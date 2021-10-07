import axios, { AxiosError, AxiosResponse } from 'axios';
import { Singletons, SingletonKey } from '../tools/singleton/Singletons';
import { IUserService } from './IUserService';
import { IApiService } from './IApiService';

export class ApiService implements IApiService {
	private _userSvc: IUserService;
	private _api: string = '{{server}}';

	constructor() {
		this._userSvc = Singletons.Load<IUserService>(SingletonKey.user);
	}

	public post<T1, T2>(route: string, body: T1, resultFunc: (e: T2) => void, errorFunc: (e: ApiError) => void): void {
		const conf: any = {
			headers: {
				Authorization: this._userSvc.hasToken() ? `Bearer ${this._userSvc.getUser().token.data}` : ''
			}
		};

		axios
			.post(`${this._api}/${route}`, body, conf)
			.then((response: AxiosResponse<T2>) => {
				resultFunc(response.data);
			})
			.catch((error: AxiosError<ApiError>) => {
				this.handleError(error, errorFunc);
			});
	}

	public delete<T1, T2>(
		route: string,
		value: T1,
		resultFunc: (e: T2) => void,
		errorFunc: (e: ApiError) => void
	): void {
		const conf: any = {
			headers: {
				Authorization: this._userSvc.hasToken() ? `Bearer ${this._userSvc.getUser().token.data}` : ''
			},
			data: value
		};

		axios
			.delete(`${this._api}/${route}`, conf)
			.then((response: AxiosResponse<T2>) => {
				resultFunc(response.data);
			})
			.catch((error: AxiosError<ApiError>) => {
				this.handleError(error, errorFunc);
			});
	}

	public get<T1, T2>(route: string, params: T1, resultFunc: (e: T2) => void, errorFunc: (e: ApiError) => void): void {
		const conf: any = {
			headers: {
				Authorization: this._userSvc.hasToken() ? `Bearer ${this._userSvc.getUser().token.data}` : ''
			},
			params: params
		};

		axios
			.get(`${this._api}/${route}`, conf)
			.then((response: AxiosResponse<T2>) => {
				resultFunc(response.data);
			})
			.catch((error: AxiosError<ApiError>) => {
				this.handleError(error, errorFunc);
			});
	}

	private handleError(error: AxiosError<ApiError>, errorFunc: (e: ApiError) => void) {
		if (error.response && error.response.data && error.response.data.description && error.response.data.name) {
			errorFunc(error.response.data);
		} else if (error.response && error.response.data && typeof error.response.data === 'string') {
			const err = new ApiError();
			err.name = `${error.response.status}`;
			err.description = <string>(<unknown>error.response.data);
			errorFunc(err);
		} else {
			const err = new ApiError();
			err.name = error.name;
			err.description = error.message;
			errorFunc(err);
		}
	}
}

export class ApiError {
	public name: string;
	public description: string;
}
