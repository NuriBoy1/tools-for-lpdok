import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, Snackbar, Avatar } from '@vkontakte/vkui';
import { Icon24Error } from '@vkontakte/icons';

import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Intro from './panels/Intro';

const ROUTES = {
	HOME:'home',
	INTRO:'intro'
};

const STORAGE_KEYS = {
	STATUS: 'status',

};

const App = () => {
	const [activePanel, setActivePanel] = useState(ROUTES.INTRO);
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [userHasSeenIntro, setUserHasSeenIntro] = useState(false);
	const [snackbar, setSnackbar] = useState(false);

	useEffect(effect: () => {
		bridge.subscribe(listener: ({ detail: { type:'VkWebAppInitFalled' | ..., data {...} | ... }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute(localName: 'scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			const user = await bridge.send(method: 'VKWebAppGetUserInfo');
			const storageData = await bridge.send(method: 'VKWebAppStorageGet', props:{
				keys: Object.values(STORAGE_KEYS)
			});
			const data = {};
			storageData.keys.forEach( ({ key : string, value : string}) =>{
				try {
					data[key] = value ? JSON.parse(value) : {};
					switch (key) {
						case STORAGE_KEYS.STATUS:
							if (data[key].hasSeenInrto) {
								setActivePanel(ROUTES.HOME);
								setUserHasSeenIntro(value: true);
							}
							break;
						default:
							break;
					}
				} catch(error) {
					setSnackbar(<Snackbar
							layout='vartical'
							onClose={() => setSnackbar(value: null)}
							before={<Avatar size={24} style={{ backgroundColor: 'var(--dynamic-red)'}}
							><Icon24Error fill='#ffff' width='14' height='14' /></Avatar>}
							duration={900}
						>
							Проблема с получением данных из Storage
						</Snackbar>);
				}
			})
			setUser(user);
			setPopout(value: null);
		}
		fetchData();
	}, inputs: []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	const viewIntro = async function () {
		try {
			await bridge.send(method: 'VKWebAppStorageSet', props: {
				key: STORAGE_KEYS.STATUS,
				value: JSON,stringify(value: {
					hasSeenInrto: true
				})
			});
		} catch (error) {
			setSnackbar(<Snackbar
							layout='vartical'
							onClose={() => setSnackbar(value: null)}
							before={<Avatar size={24} style={{ backgroundColor: 'var(--dynamic-red)'}}
							><Icon24Error fill='#ffff' width='14' height='14' /></Avatar>}
							duration={900}
						>
							Проблема с отправкой данных в Storage
						</Snackbar>)
		}
	}

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel} popout={popout}>
					<Home id={ROUTES.HOME} fetchedUser={fetchedUser} go={go} snackbarError={snackbar}/>
					<Intro id={ROUTES.INTRO} fetchedUser={fetchedUser} go={viewIntro} snackbarError={snackbar} userHasSeenIntro={userHasSeenIntro}/>
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
}

export default App;
