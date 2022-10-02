import CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

Storage.prototype._setItem = Storage.prototype.setItem
Storage.prototype._getItem = Storage.prototype.getItem

Storage.prototype.setItem = function (key, value) {
    this._setItem(key, CryptoJS.AES.encrypt(value, environment.privateKey).toString())
}

Storage.prototype.getItem = function (key) {
    const value = this._getItem(key)
    if (value) {
        try {
            return CryptoJS.AES.decrypt(value, environment.privateKey).toString(CryptoJS.enc.Utf8)
        } catch (error) {
            localStorage.clear();
            sessionStorage.clear();
        }
    } else {
        return null
    }
}
