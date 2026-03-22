/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║               CartaYa — Supabase Auth Service               ║
 * ║                     auth.service.js                         ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * INSTRUCCIONES DE CONFIGURACIÓN (5 minutos):
 * ─────────────────────────────────────────────
 * 1. Ve a https://supabase.com y crea una cuenta gratis
 * 2. Crea un nuevo proyecto (ej: "cartaya-prod")
 * 3. En tu proyecto: Settings → API
 * 4. Copia los valores de:
 *    - Project URL       → SUPABASE_URL
 *    - anon public key   → SUPABASE_ANON_KEY
 * 5. Reemplaza los valores de abajo
 *
 * BASE DE DATOS — Ejecuta este SQL en Supabase:
 * ─────────────────────────────────────────────
 * (Dashboard → SQL Editor → New Query → pega y ejecuta)
 *
 * -- Tabla de restaurantes (vinculada a auth.users)
 * CREATE TABLE IF NOT EXISTS public.restaurants (
 *   id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
 *   name          TEXT NOT NULL,
 *   slug          TEXT UNIQUE,
 *   city          TEXT,
 *   neighborhood  TEXT,
 *   description   TEXT,
 *   cuisine_types TEXT[],
 *   business_type TEXT,
 *   phone         TEXT,
 *   whatsapp      TEXT,
 *   instagram     TEXT,
 *   address       TEXT,
 *   schedule      TEXT,
 *   avg_price     TEXT,
 *   plan          TEXT DEFAULT 'free',
 *   plan_expires_at TIMESTAMPTZ,
 *   is_active     BOOLEAN DEFAULT true,
 *   created_at    TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at    TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * -- Tabla de platos del menú
 * CREATE TABLE IF NOT EXISTS public.dishes (
 *   id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
 *   name          TEXT NOT NULL,
 *   description   TEXT,
 *   price         TEXT,
 *   category      TEXT,
 *   emoji         TEXT DEFAULT '🍽️',
 *   is_featured   BOOLEAN DEFAULT false,
 *   is_active     BOOLEAN DEFAULT true,
 *   sort_order    INT DEFAULT 0,
 *   created_at    TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * -- Row Level Security (muy importante!)
 * ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE public.dishes      ENABLE ROW LEVEL SECURITY;
 *
 * -- Policies: cada usuario solo ve sus propios datos
 * CREATE POLICY "Users can view own restaurant"
 *   ON public.restaurants FOR SELECT
 *   USING (auth.uid() = user_id);
 *
 * CREATE POLICY "Users can insert own restaurant"
 *   ON public.restaurants FOR INSERT
 *   WITH CHECK (auth.uid() = user_id);
 *
 * CREATE POLICY "Users can update own restaurant"
 *   ON public.restaurants FOR UPDATE
 *   USING (auth.uid() = user_id);
 *
 * CREATE POLICY "Users can manage own dishes"
 *   ON public.dishes FOR ALL
 *   USING (restaurant_id IN (
 *     SELECT id FROM public.restaurants WHERE user_id = auth.uid()
 *   ));
 *
 * -- Función para auto-actualizar updated_at
 * CREATE OR REPLACE FUNCTION handle_updated_at()
 * RETURNS TRIGGER AS $$
 * BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
 * $$ LANGUAGE plpgsql;
 *
 * CREATE TRIGGER set_updated_at
 *   BEFORE UPDATE ON public.restaurants
 *   FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
 */

/* ══════════════════════════════════════════════
   🔴 REEMPLAZA ESTOS VALORES CON LOS TUYOS
══════════════════════════════════════════════ */
const SUPABASE_URL      = 'https://yvatgoylkcxmrfbfuemc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2YXRnb3lsa2N4bXJmYmZ1ZW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMjQ5MjYsImV4cCI6MjA4OTcwMDkyNn0.E5uMtC4bGv5YwM3C-z6vBVWhPErGHTt6--FvWSvRHXk';
/* ══════════════════════════════════════════════ */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ════════════════════════════════
   AUTH FUNCTIONS
════════════════════════════════ */

/**
 * Registrar nuevo usuario
 * @param {string} email
 * @param {string} password
 * @param {object} meta  — { firstName, lastName, phone }
 */
export async function signUp(email, password, meta = {}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: meta.firstName || '',
        last_name:  meta.lastName  || '',
        phone:      meta.phone     || '',
        full_name:  `${meta.firstName || ''} ${meta.lastName || ''}`.trim(),
      },
      // URL a la que redirige tras confirmar el email
      emailRedirectTo: `${window.location.origin}/dashboard.html`,
    },
  });
  if (error) throw error;
  return data;
}

/**
 * Iniciar sesión con email + contraseña
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/**
 * Login con OAuth (Google / Facebook)
 * @param {'google'|'facebook'} provider
 */
export async function signInWithOAuth(provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/dashboard.html` },
  });
  if (error) throw error;
  return data;
}

/**
 * Cerrar sesión
 */
export async function signOut(redirectTo = '../login-supabase.html') {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  window.location.href = redirectTo;
}

/**
 * Recuperar contraseña — envía email con link
 */
export async function resetPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password.html`,
  });
  if (error) throw error;
  return data;
}

/**
 * Obtener usuario activo (o null si no hay sesión)
 */
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Guardar datos del restaurante en la BD
 * @param {string} userId
 * @param {object} restaurantData
 */
export async function saveRestaurant(userId, restaurantData) {
  const slug = restaurantData.name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
    .substring(0, 30);

  const { data, error } = await supabase
    .from('restaurants')
    .upsert({
      user_id:       userId,
      name:          restaurantData.name,
      slug:          slug,
      city:          restaurantData.city        || null,
      cuisine_types: restaurantData.cuisineTypes || [],
      business_type: restaurantData.businessType || null,
      description:   restaurantData.description  || null,
      whatsapp:      restaurantData.phone        || null,
      plan:          restaurantData.plan         || 'free',
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Guardar platos del menú (Borrando los anteriores para no duplicar)
 */
export async function saveDishes(restaurantId, dishes) {
  // Primero borramos todos los platos actuales
  await supabase.from('dishes').delete().eq('restaurant_id', restaurantId);
  
  if (!dishes || !dishes.length) return [];
  const rows = dishes.map((d, i) => ({
    restaurant_id: restaurantId,
    name:          d.name,
    price:         d.price || null,
    category:      d.category || !!d.cat ? d.cat : 'General',
    emoji:         d.emoji || d.em || '🍽️',
    sort_order:    i,
  }));
  const { data, error } = await supabase.from('dishes').insert(rows).select();
  if (error) throw error;
  return data;
}

/**
 * Subir foto al bucket (restaurant-photos)
 */
export async function uploadPhoto(restaurantId, file) {
  const fileExt = file.name.split('.').pop();
  const filePath = `${restaurantId}/${Math.random()}.${fileExt}`;
  const { data, error } = await supabase.storage.from('restaurant-photos').upload(filePath, file);
  if (error) throw error;
  const { data: publicData } = supabase.storage.from('restaurant-photos').getPublicUrl(filePath);
  return publicData.publicUrl;
}

/**
 * Obtener restaurante del usuario actual
 */
export async function getMyRestaurant() {
  const user = await getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('restaurants')
    .select('*, dishes(*)')
    .eq('user_id', user.id)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

/**
 * Guard: redirige a login si no hay sesión
 * Úsalo al inicio de dashboard.html
 */
export async function requireAuth(redirectTo = '../login-supabase.html') {
  const user = await getUser();
  if (!user) window.location.href = redirectTo;
  return user;
}

/* ════════════════════════════════
   ERROR MESSAGES EN ESPAÑOL
════════════════════════════════ */
export function translateError(error) {
  const map = {
    'Invalid login credentials':      'Correo o contraseña incorrectos.',
    'Email not confirmed':             'Debes confirmar tu correo primero. Revisa tu bandeja.',
    'User already registered':         'Este correo ya tiene una cuenta. Intenta iniciar sesión.',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
    'Unable to validate email address: invalid format': 'El formato del correo no es válido.',
    'signup disabled':                 'El registro está temporalmente deshabilitado.',
    'Email rate limit exceeded':       'Demasiados intentos. Espera unos minutos.',
    'over email rate limit':           'Demasiados envíos. Intenta más tarde.',
  };
  for (const [key, msg] of Object.entries(map)) {
    if (error.message?.includes(key)) return msg;
  }
  return error.message || 'Ocurrió un error. Intenta de nuevo.';
}
