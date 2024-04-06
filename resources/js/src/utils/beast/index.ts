import { Model } from './models/model'
import { LocalStorage } from './models/model'
import * as Fields from './models/field/fields'
import { ModelReader } from './models/model.reader'
import { registerModel, migrate } from './models/register-model'


export const models = {
	Model,
	LocalStorage,
	read: ModelReader.read,
	migrate: migrate,
	register: registerModel.register,
	...Fields,
	Value(arg) {
		if(arg == 'null') {
			return {}
		}
	},
}