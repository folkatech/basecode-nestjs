import * as JsonAPISerializer from 'json-api-serializer';

export const resourceNames = [
  'article',
  'category',
  'consultation',
  'clinical-program',
  'clinical-program-category',
  'clinical-program-before-after',
  'clinical-program-location',
  'tada-coupon',
  'doctor',
  'doctor-login',
  'doctor-schedule',
  'doctor-treatment',
  'doctor-telemed',
  'equipment-maintenance',
  'excel-appointment',
  'excel-telemedicine',
  'excel-transaction-history',
  'nurse',
  'nurse-treatment',
  'nurse-schedule',
  'therapist',
  'therapist-treatment',
  'therapist-schedule',
  'product',
  'product-variant',
  'request-otp',
  'users',
  'user-login',
  'user-address',
  'verihubs',
  'province',
  'city',
  'kecamatan',
  'clinic',
  'clinic-doctor',
  'clinic-equipment',
  'clinic-equipment-maintenance',
  'clinic-treatment',
  'clinic-nurse',
  'clinic-schedule',
  'clinic-schedule-shift',
  'schedule-occurance',
  'schedule-shift',
  'schedule-timeoff',
  'clinic-therapist',
  'treatment',
  'treatment-equipment',
  'telemedicine',
  'equipment',
  'review',
  'wishlist',
  'cart',
  'cart-item',
  'order',
  'appointment',
  'appointment-log',
  'appointment-photo',
  'inbox',
  'appointment-check-in',
  'prescription',
  'payment-method',
  'payment-method-type',
  'setting',
  'invoice',
  'invoice-callback',
  'invoice-calculation',
  'courier-service',
  'courier-history',
  'courier-code',
  'user-coupon',
  'admin',
  'schedule',
  'appointment-doctor-notes',
  'search',
  'update-app',
  'permission',
  'role',
] as const;

export type Resource = typeof resourceNames[number];

export class BaseResource {
  protected serializer = new JsonAPISerializer();

  /**
   * resource string name
   * @param resourceName
   * @param data
   */
  constructor(resourceName: Resource, data: any) {
    /**
     * @see {resource}
     * register all defined resource
     * */
    resourceNames.forEach((market: Resource) => {
      this.serializer.register(market, { id: 'id' });
    });

    return this.serializer.serialize(resourceName, data);
  }
}
