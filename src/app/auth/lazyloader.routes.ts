import { Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

export const appRoutes: Routes = [{
    path: '', component: AuthComponent, children: [
        { path: 'dashboard', component: DashboardComponent },
        { path: 'invoices', loadChildren: '../invoices/invoices.module#InvoicesModule' },
        { path: 'customers', loadChildren: '../customers/customers.module#CustomersModule' },
        { path: 'settings', loadChildren: '../settings/settings.module#SettingsModule' },
        { path: 'reports', loadChildren: '../reports/reports.module#ReportsModule' },
        { path: 'payments', loadChildren: '../payments/payments.module#PaymentsModule' }
    ]
}];
