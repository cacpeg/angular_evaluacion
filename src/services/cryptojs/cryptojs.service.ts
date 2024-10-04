import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

const secret = 'A7ju38EWg6mUZE2KA7ju38EWg6mUZE2K';
const key = CryptoJS.enc.Utf8.parse(secret);
const iv = CryptoJS.enc.Utf8.parse(secret);

@Injectable({
	providedIn: 'root'
})
export class CryptojsService {

	constructor() { }

	encriptar(data: string) {
		let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data),
			key,
			{
				iv: iv,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			});


		return String(encrypted);
	}

	desencriptar(data: string) {
		let decrypted = CryptoJS.AES.decrypt(data,
			key,
			{
				iv: iv,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			});

		return decrypted.toString(CryptoJS.enc.Utf8);
	}
}
