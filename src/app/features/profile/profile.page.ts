import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	IonContent,
	IonHeader,
	IonIcon,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
	calendarOutline,
	callOutline,
	locationOutline,
	mailOutline,
	timeOutline,
} from 'ionicons/icons';

import { Profile } from '../../core/interfaces/profile.model';

const FAKE_PROFILE: Profile = {
	id: 'USR-2024-SDI',
	fullName: 'John Doe',
	email: 'john.doe@prestashop.es',
	phone: '+34 600 000 000',
	city: 'Logroño, España',
	role: 'Desarrollador Full Stack',
	avatarUrl: 'https://picsum.photos/id/64/180/180',
	memberSince: 'Enero 2024',
	lastLogin: 'Ahora mismo',
	bio: 'Apasionado por la tecnología y el desarrollo de aplicaciones móviles con Ionic y Angular.',
};

@Component({
	selector: 'app-profile',
	standalone: true,
	templateUrl: './profile.page.html',
	styleUrls: ['./profile.page.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonIcon,
	],
})
export class ProfilePage {
	readonly profile = signal<Profile>(FAKE_PROFILE);

	readonly details = computed(() => {
		const profile = this.profile();
		return [
			{ label: 'Correo', value: profile.email, icon: 'mail-outline' },
			{ label: 'Teléfono', value: profile.phone, icon: 'call-outline' },
			{ label: 'Ciudad', value: profile.city, icon: 'location-outline' },
			{ label: 'Miembro desde', value: profile.memberSince, icon: 'calendar-outline' },
			{ label: 'Último acceso', value: profile.lastLogin, icon: 'time-outline' },
		];
	});

	constructor() {
		addIcons({
			mailOutline,
			callOutline,
			locationOutline,
			calendarOutline,
			timeOutline,
		});
	}
}
