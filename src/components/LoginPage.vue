<template>
  <div class="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(20,20,20,1),_rgba(10,10,10,1))] px-4 py-10 text-slate-100 sm:px-6 lg:px-10">
    <div class="w-full max-w-md rounded-[2rem] border border-zinc-800 bg-zinc-900/90 p-8 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.7)]">
      <div class="mb-8 text-center">
        <p class="text-sm uppercase tracking-[0.3em] text-slate-500">Login</p>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight text-slate-100">
          Masuk ke Dashboard
        </h2>
        <p class="mt-2 text-sm text-slate-400">
          Masukkan username dan password yang valid untuk melanjutkan.
        </p>
      </div>

      <form @submit.prevent="submitLogin" class="space-y-5">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-300" for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            autocomplete="username"
            class="w-full rounded-3xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-lime-400"
            placeholder="admin"
            required
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-300" for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="w-full rounded-3xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-lime-400"
            placeholder="••••••••"
            required
          />
        </div>

        <div v-if="auth.errorMessage" class="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
          {{ auth.errorMessage }}
        </div>

        <button
          type="submit"
          class="w-full rounded-3xl bg-lime-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-lime-400"
        >
          Login
        </button>
      </form>

      <!-- <div class="mt-6 text-sm text-slate-500">
        <p>Contoh akun:</p>
        <p class="mt-2">admin / admin123</p>
        <p>user / user123</p>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/useAuthStore";

const auth = useAuthStore();
const username = ref("");
const password = ref("");

function submitLogin() {
  auth.login(username.value.trim(), password.value);
}
</script>
