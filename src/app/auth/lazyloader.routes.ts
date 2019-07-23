import { Routes } from '@angular/router';
import { AuthComponent } from './auth.component';

export const appRoutes: Routes = [{
    path: '', component: AuthComponent, children: [
        { path: 'dashboard', loadChildren: "../modules/dashboard/dashboard.module#DashboardModule" },
        { path: 'invoices', loadChildren: '../modules/invoices/invoices.module#InvoicesModule' },
        { path: 'customers', loadChildren: '../modules/customers/customers.module#CustomersModule' },
        { path: 'settings', loadChildren: '../modules/settings/settings.module#SettingsModule' },
        { path: 'reports', loadChildren: '../modules/reports/reports.module#ReportsModule' },
        { path: 'payments', loadChildren: '../modules/payments/payments.module#PaymentsModule' },
        { path: 'tax', loadChildren: '../modules/tax/tax.module#TaxModule' },
        { path: 'item', loadChildren: '../modules/item/item.module#ItemModule' },
        { path: 'team', loadChildren: '../modules/team/team.module#TeamModule' }
    ]
}];
