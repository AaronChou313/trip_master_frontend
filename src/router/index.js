import { createRouter, createWebHashHistory } from 'vue-router';
import PoisView from '../views/PoisView.vue';
import ItineraryView from '../views/ItineraryView.vue';
import BudgetView from '../views/BudgetView.vue';
import MemosView from '../views/MemosView.vue';
import EnvTestView from '../views/EnvTestView.vue';

const routes = [
  {
    path: '/',
    redirect: '/pois'
  },
  {
    path: '/pois',
    name: 'Pois',
    component: PoisView
  },
  {
    path: '/itinerary',
    name: 'Itinerary',
    component: ItineraryView
  },
  {
    path: '/budget',
    name: 'Budget',
    component: BudgetView
  },
  {
    path: '/memos',
    name: 'Memos',
    component: MemosView
  },
  {
    path: '/env-test',
    name: 'EnvTest',
    component: EnvTestView
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;