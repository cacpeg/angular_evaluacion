// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,  
	//apiUrl: 'https://apis.coopgualaquiza.fin.ec/WSAppMovilPruebas/api/',
	apiUrl: 'http://192.168.112.133:5000/api',
	//apiUrl: 'https://apis.coopgualaquiza.fin.ec/WSAppMovilPruebas2/api',
	dateFormat: 'dd/MM/yyyy',
	dateTimeFormat: 'dd/MM/yyyy HH:dd',
	timeFormat: 'HH:dd', 
	timeFormatextensive: 'HH:dd:ss', 
	dateTimeFormatextensive:'dd/MM/yyyy HH:dd:ss',
	encriptacion: true,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
