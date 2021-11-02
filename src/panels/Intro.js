import React from 'react';
import PropTypes from 'prop-types';

import { Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';

import './Intro.css';

const Intro = ({ id, snackbarError, fetchedUser, userHasSeenIntro, go }) => {
	return (
		<Panel id={id} centered={true}>
			<PanelHeader>
				Туалетка
			</PanelHeader>
			{(!userHasSeenIntro && fetchedUser) && 'Hi!'}
			{snackbarError}
		</Panel>
	)
};


export default Intro;
