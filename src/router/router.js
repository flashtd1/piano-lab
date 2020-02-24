import IndexPage from '../views/index'
import PianoPage from '../views/piano'
import Sheet from '../views/sheet'

export default [
    {
        path: '/',
        name: '首页',
        component: IndexPage
    },
    {
        path: '/player',
        name: '播放器',
        component: Sheet
    },
    {
        path: '/piano',
        name: '网页钢琴',
        component: PianoPage
    }
]