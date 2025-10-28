
      import React from 'react';
      import ReactDOM from 'react-dom';
      import { Area } from '@evershop/evershop/components/common';
      import {HydrateFrontStore} from '@evershop/evershop/components/common';
      
import ea13aa1a6ddf884c873db9bfc0ad633a3 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/catalog/pages/frontStore/all/SearchBox.js';
import ec5cd204851d27ac4400ed186122c64b2 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/checkout/pages/frontStore/all/MiniCart.js';
import e876dddd85b669b6ea87789c586899dca from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/checkout/pages/frontStore/cart/ShoppingCart.js';
import ec5f1bfaa81bf071c19753d5fa58627fe from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/checkout/pages/frontStore/cart/Summary.js';
import e67d352039c9bf58a04a313c5b3787a12 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/cms/pages/frontStore/all/Breadcrumb.js';
import e5bde189ae96950ab8bf10ea9a6b88e99 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/cms/pages/frontStore/all/Footer.js';
import e45746a543d0b1849db331b70990c5245 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/cms/pages/frontStore/all/HeadTags.js';
import e4d981d6498dd758aeed1a219bbec2c98 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/cms/pages/frontStore/all/Layout.js';
import eb326fbb0ab53348f6f954d50674e5621 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/cms/pages/frontStore/all/Logo.js';
import e49a7ce8d1775bd308f4c44ef5c2ef19d from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/cms/pages/frontStore/all/Notification.js';
import e8161d215173e9c94b8bdedc8edab5ed8 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/customer/pages/frontStore/all/UserIcon.js';
import ee7d3be897940494255eede278b7989d1 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/promotion/pages/frontStore/cart/Coupon.js';
import collection_products from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/components/frontStore/widgets/CollectionProducts.js';
import text_block from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/components/frontStore/widgets/TextBlock.js';
import basic_menu from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/components/frontStore/widgets/BasicMenu.js';
Area.defaultProps.components = {
  'icon-wrapper': {
    ea13aa1a6ddf884c873db9bfc0ad633a3: {
      id: 'ea13aa1a6ddf884c873db9bfc0ad633a3',
      sortOrder: 5,
      component: { default: ea13aa1a6ddf884c873db9bfc0ad633a3 }
    },
    ec5cd204851d27ac4400ed186122c64b2: {
      id: 'ec5cd204851d27ac4400ed186122c64b2',
      sortOrder: 10,
      component: { default: ec5cd204851d27ac4400ed186122c64b2 }
    },
    e8161d215173e9c94b8bdedc8edab5ed8: {
      id: 'e8161d215173e9c94b8bdedc8edab5ed8',
      sortOrder: 30,
      component: { default: e8161d215173e9c94b8bdedc8edab5ed8 }
    }
  },
  content: {
    e876dddd85b669b6ea87789c586899dca: {
      id: 'e876dddd85b669b6ea87789c586899dca',
      sortOrder: 10,
      component: { default: e876dddd85b669b6ea87789c586899dca }
    },
    e67d352039c9bf58a04a313c5b3787a12: {
      id: 'e67d352039c9bf58a04a313c5b3787a12',
      sortOrder: 0,
      component: { default: e67d352039c9bf58a04a313c5b3787a12 }
    }
  },
  shoppingCartRight: {
    ec5f1bfaa81bf071c19753d5fa58627fe: {
      id: 'ec5f1bfaa81bf071c19753d5fa58627fe',
      sortOrder: 10,
      component: { default: ec5f1bfaa81bf071c19753d5fa58627fe }
    }
  },
  footer: {
    e5bde189ae96950ab8bf10ea9a6b88e99: {
      id: 'e5bde189ae96950ab8bf10ea9a6b88e99',
      sortOrder: 10,
      component: { default: e5bde189ae96950ab8bf10ea9a6b88e99 }
    }
  },
  head: {
    e45746a543d0b1849db331b70990c5245: {
      id: 'e45746a543d0b1849db331b70990c5245',
      sortOrder: 5,
      component: { default: e45746a543d0b1849db331b70990c5245 }
    }
  },
  body: {
    e4d981d6498dd758aeed1a219bbec2c98: {
      id: 'e4d981d6498dd758aeed1a219bbec2c98',
      sortOrder: 1,
      component: { default: e4d981d6498dd758aeed1a219bbec2c98 }
    },
    e49a7ce8d1775bd308f4c44ef5c2ef19d: {
      id: 'e49a7ce8d1775bd308f4c44ef5c2ef19d',
      sortOrder: 10,
      component: { default: e49a7ce8d1775bd308f4c44ef5c2ef19d }
    }
  },
  header: {
    eb326fbb0ab53348f6f954d50674e5621: {
      id: 'eb326fbb0ab53348f6f954d50674e5621',
      sortOrder: 10,
      component: { default: eb326fbb0ab53348f6f954d50674e5621 }
    }
  },
  shoppingCartLeft: {
    ee7d3be897940494255eede278b7989d1: {
      id: 'ee7d3be897940494255eede278b7989d1',
      sortOrder: 20,
      component: { default: ee7d3be897940494255eede278b7989d1 }
    }
  },
  '*': {
    collection_products: {
      id: 'collection_products',
      sortOrder: 0,
      component: { default: collection_products }
    },
    text_block: {
      id: 'text_block',
      sortOrder: 0,
      component: { default: text_block }
    },
    basic_menu: {
      id: 'basic_menu',
      sortOrder: 0,
      component: { default: basic_menu }
    }
  }
} 
ReactDOM.hydrate(
        React.createElement(HydrateFrontStore, null),
        document.getElementById('app')
      );