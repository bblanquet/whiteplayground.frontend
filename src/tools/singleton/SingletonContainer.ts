import { ApiService } from '../../services/ApiService';
import { NotificationService } from '../../services/NotficationService';
import { UserService } from '../../services/UserService';
import { Singletons, SingletonKey } from './Singletons';

export class SingletonContainer {
	Register(): void {
		Singletons.Register(SingletonKey.notification, new NotificationService());
		Singletons.Register(SingletonKey.user, new UserService());
		Singletons.Register(SingletonKey.api, new ApiService());
	}
}
