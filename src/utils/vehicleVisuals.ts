import { VehicleCategory } from '../types';
import sportImg from '../assets/images/garage_sport_coupe_1795211502851.jpg';
import muscleImg from '../assets/images/garage_muscle_car_1795211503098.jpg';
import motoImg from '../assets/images/garage_cyber_moto_1795211506040.jpg';
import offroadImg from '../assets/images/garage_offroad_4x4_1795211504380.jpg';
import heavyImg from '../assets/images/garage_heavy_special_1795211503801.jpg';

export const VEHICLE_CATEGORY_LABELS: Record<VehicleCategory, string> = {
  car: 'Voiture',
  sport: 'Sport',
  muscle: 'Muscle / Coupé',
  moto: 'Moto',
  offroad: 'Tout-terrain',
  special: 'Spécial',
  heavy: 'Lourd / Blindé',
};

export const VEHICLE_CATEGORY_LABELS_EN: Record<VehicleCategory, string> = {
  car: 'Standard',
  sport: 'Sport',
  muscle: 'Muscle / Coupe',
  moto: 'Moto',
  offroad: 'Off-Road',
  special: 'Special',
  heavy: 'Heavy / Armored',
};

export function getVehicleCategoryLabel(category: VehicleCategory, locale: 'en' | 'fr'): string {
  return locale === 'fr' ? VEHICLE_CATEGORY_LABELS[category] : VEHICLE_CATEGORY_LABELS_EN[category];
}

export function getDefaultVehicleImage(category: VehicleCategory): string {
  switch (category) {
    case 'sport':
      return sportImg;
    case 'muscle':
    case 'car':
      return muscleImg;
    case 'moto':
      return motoImg;
    case 'offroad':
      return offroadImg;
    case 'special':
    case 'heavy':
      return heavyImg;
    default:
      return sportImg;
  }
}

const SAFE_RASTER_DATA_URI =
  /^data:image\/(png|jpeg|jpg|webp|gif|avif);base64,[a-zA-Z0-9+/=\s]+$/i;

export function isValidImageUrl(url?: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (SAFE_RASTER_DATA_URI.test(trimmed)) return true;
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}
