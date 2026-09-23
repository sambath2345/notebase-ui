import {createRouter, createWebHistory} from 'vue-router'
import {useAuthStore} from '../stores/auth'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue'),
            meta: {guestOnly: true, title: 'Sign in'},
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/RegisterView.vue'),
            meta: {guestOnly: true, title: 'Create account'},
        },
        {
            path: '/',
            component: () => import('../layouts/MainLayout.vue'),
            meta: {requiresAuth: true},
            children: [
                {path: '', redirect: '/notes'},
                {
                    path: 'notes',
                    name: 'notes',
                    component: () => import('../views/NotesView.vue'),
                    meta: {title: 'My notes'},
                },
            ],
        },
    ],
})

router.beforeEach((to) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return {name: 'login', query: {redirect: to.fullPath}}
    }

    if (to.meta.guestOnly && authStore.isAuthenticated) {
        return {name: 'notes'}
    }

    return true
})

router.afterEach((to) => {
    document.title = to.meta.title ? `${to.meta.title} · NoteBase` : 'NoteBase'
})

export default router
