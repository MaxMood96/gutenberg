/**
 * @flow
 * @format
 * */

/**
 * External dependencies
 */
import childProcess from 'child_process';

// Spawns an appium process
export const start = ( localAppiumPort: number ) => new Promise<child_process$ChildProcess>( ( resolve, reject ) => {
	const appium = childProcess.spawn( 'appium', [
		'--port', localAppiumPort.toString(),
		'--log', './appium-out.log',
		'--log-no-colors'
	] );

	let appiumOutputBuffer = '';
	let resolved = false;
	appium.stdout.on( 'data', ( data ) => {
		if ( ! resolved ) {
			appiumOutputBuffer += data.toString();
			if ( appiumOutputBuffer.indexOf( 'Appium REST http interface listener started' ) >= 0 ) {
				resolved = true;
				resolve( appium );
			}
		}
	} );

	appium.on( 'close', ( code ) => {
		if ( ! resolved ) {
			reject( new Error( `Appium process exited with code ${ code }` ) );
		}
	} );
} );

export const stop = async ( appium: ?child_process$ChildProcess ) => {
	if ( ! appium ) {
		return;
	}
	await appium.kill( 'SIGINT' );
};

export default {
	start,
	stop,
};
