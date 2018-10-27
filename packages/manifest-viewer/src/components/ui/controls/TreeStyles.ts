export default {
  tree: {
    base: {
      backgroundColor: '#FFF',
      color: '#000',
      fontColor: '#000',
      fontFamily: 'lucida grande,tahoma,verdana,arial,sans-serif',
      fontSize: '13px',
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
    node: {
      base: {
        border: '1px solid rgba(0, 0, 0, 0.125)',
        position: 'relative',
      },
      container: {
        activeLink: {
          backgroundColor: 'silver',
        },
        link: {
          display: 'block',
          padding: '0px 5px',
          position: 'relative',
        },
      },
      header: {
        base: {
          '&:hover': {
            backgroundColor: '#f8f9fa',
          },
          'color': '#000',
          'display': 'list-item',
          'verticalAlign': 'top',
        },
        connector: {
          borderBottom: 'solid 2px black',
          borderLeft: 'solid 2px black',
          height: '12px',
          left: '-21px',
          position: 'absolute',
          top: '0px',
          width: '2px',
        },
        nodeLink: {
          '&:hover': {
            color: '#040677',
            textDecoration: 'underline',
          },
          'color': '#666',
          'cursor': 'pointer',
        },
        title: {
          lineHeight: '24px',
          verticalAlign: 'middle',
        },
      },

      loading: {
        color: '#E2C089',
      },
      subtree: {
        listStyle: 'none',
        paddingLeft: '19px',
      },
      toggle: {
        arrow: {
          fill: '#9DA5AB',
          strokeWidth: 0,
        },
        base: {
          listStyle: 'none',
          marginLeft: '-5px',
          position: 'relative',
          verticalAlign: 'top',
          width: '24px',
        },
        height: 14,
        width: 14,
        wrapper: {
          height: '14px',
          left: '50%',
          margin: '-7px 0 0 -7px',
          position: 'absolute',
          top: '50%',
        },
      },
    },
  },
}
