export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Dashboard 1',
        to: '/dashboard',
        icon: 'cil-speedometer'
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['NBSAPS']

      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Targets',
        route: '/nbsaps-targets',
        icon: 'cil-cursor',
        slot: 'named-slot',
        _scopedSlots: 'named-slot',
        _scopedSlot: 'named-slot',
        scopedSlots: 'named-slot',
        scopedSlot: 'named-slot',
        _attrs: { class: 'some-custom-class' },
        items: [          
          
          {
            component: 'CSidebarNavDropdown1',
            name: 'My Country Targets',
            icon: 'cil-highlighter',
            slot: 'nr6',
            scopedSlots: 'nr6',
            scopedSlot: 'nr6',
          },
          {
            name: '--   Overview',
            to: '/nbsaps-targets'
          },
          {
            name: 'New',
            to: '/nbsaps-targets/new'
          }
        ]
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['National Reports']
      },
      {
        _name: 'CSidebarNavItem',
        name: '6th National Report',
        href: 'https://chm.cbd.int/database?schema_s=nationalReport6',
        slot: 'nr6',
        _scopedSlots: 'nr6',
        icon: 'cil-puzzle'
      },
      {
        _name: 'CSidebarNavDropdown',
        name: '7th National Report',
        route: '/national-reports/nr7/edit',
        icon: 'cil-file',
        items: [
          {
            name: 'Overview',
            to: '/national-reports/nr7/edit'
          },
          {
            name: 'Section I',
            to: '/national-reports/nr7/edit/section-1'
          },
          {
            name: 'Section II',
            to: '/national-reports/nr7/edit/section-2'
          },
          {
            name: 'Section III',
            to: '/national-reports/nr7/edit/section-3'
          },
          {
            name: 'Section IV',
            to: '/national-reports/nr7/edit/section-4'
          },
          {
            name: 'Section V',
            to: '/national-reports/nr7/edit/section-5'
          },
          {
            name: 'Section VI',
            to: '/national-reports/nr7/edit/section-6'
          },
          {
            name: 'Annex',
            to: '/national-reports/nr7/edit/section-7'
          }
        ]
      }
    ]
  }
]
