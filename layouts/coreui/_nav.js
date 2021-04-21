export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: 'cil-speedometer',
        badge: {
          color: 'danger',
          text: '99+'
        }
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Dev Tools',
        route: '/devtools/devtools',
        icon: 'cil-calculator',
        _children: [
          {
            _name: 'CSidebarNavItem',
            name: 'Jenkins',
            to: ''
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Source',
            to: ''
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Images',
            to: ''
          }
        ]
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Platform',
        route: '/systemadministrator/realms/realms',
        icon: 'cil-applications-settings',
        _children: [
          {
            _name: 'CSidebarNavItem',
            name: 'Realms',
            to: '/systemadministrator/realms/realms'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Menus',
            to: '/systemadministrator/menus/menus'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Monitoring',
            to: '/systemadministrator/monitoring/monitoring'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Preferences',
            to: '/systemadministrator/preferences/preferences'
          }
        ]
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Pages',
        route: '/pages',
        icon: 'cil-star',
        items: [
          {
            name: 'Login',
            to: '/pages/login'
          },
          {
            name: 'First Login',
            to: '/pages/firstlogin'
          },
          {
            name: 'Register',
            to: '/pages/register'
          },
          {
            name: 'Error 404',
            to: '/pages/404'
          },
          {
            name: 'Error 500',
            to: '/pages/500'
          }
        ]
      }
    ]
  }
]
