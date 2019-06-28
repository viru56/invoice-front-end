import { Routes } from '@angular/router';
import { AuthComponent } from './auth.component';

export const appRoutes: Routes = [{
    path: '', component: AuthComponent, children: [
        { path: 'dashboard', loadChildren: "../dashboard/dashboard.module#DashboardModule" },
        { path: 'invoices', loadChildren: '../invoices/invoices.module#InvoicesModule' },
        { path: 'customers', loadChildren: '../customers/customers.module#CustomersModule' },
        { path: 'settings', loadChildren: '../settings/settings.module#SettingsModule' },
        { path: 'reports', loadChildren: '../reports/reports.module#ReportsModule' },
        { path: 'payments', loadChildren: '../payments/payments.module#PaymentsModule' }
    ]
}];
