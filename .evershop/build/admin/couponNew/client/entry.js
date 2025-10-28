
      import React from 'react';
      import ReactDOM from 'react-dom';
      import { Area } from '@evershop/evershop/components/common';
      import {HydrateAdmin} from '@evershop/evershop/components/common';
      
import ef9293976f96fbd24c6b0ef082d095c35 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/auth/pages/admin/all/AdminUser.js';
import ec8b0c5a98de1f093e7ee701af0f7be97 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/catalog/pages/admin/all/CatalogMenuGroup.js';
import e094423146d2478260bf4a7864d739be6 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/catalog/pages/admin/all/NewProductQuickLink.js';
import eef5d51f8a0d8812fff952b15f7c792e3 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/checkout/pages/admin/all/ShippingSettingMenu.js';
import ee1e6ee125e7aa44a79c2aa731a1ad982 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/cms/pages/admin/all/CmsMenuGroup.js';
import e2b4952ff3fadd3b10de07a930a6b8c50 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/cms/pages/admin/all/CopyRight.js';
import e742367ef3f19582da0f91a2cc48eb31d from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/cms/pages/admin/all/Layout.js';
import ee493f401b0b0d115172a9145ed009969 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/cms/pages/admin/all/Logo.js';
import ec5d19bdae26a618f6abc2d4b5532fc37 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/cms/pages/admin/all/Meta.js';
import e8e9073bc712311ef24f2bfe597649347 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/cms/pages/admin/all/Navigation.js';
import e192361e5a279f4f19d18f519e43ff03a from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/cms/pages/admin/all/Notification.js';
import e4a77b0b4d71fe22e8fa1d077756c91ee from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/cms/pages/admin/all/QuickLinks.js';
import ec30ef99cf5607a457ccea820ba38bad8 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/cms/pages/admin/all/SearchBox.js';
import e5278d46ded25164c3981871dae35e8ef from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/cms/pages/admin/all/Version.js';
import e7df1fed5bea35ee47b820e56fee5556d from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/customer/pages/admin/all/CustomerMenuGroup.js';
import e8f710ddf74ba8b1747194e2f2a1bcb1a from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/oms/pages/admin/all/OmsMenuGroup.js';
import ea0906da0ac46f88595e246d89070a001 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/promotion/pages/admin/all/CouponMenuGroup.js';
import e915f4b15ad6246386b3011d2d77d20c6 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/promotion/pages/admin/all/NewCouponQuickLink.js';
import ee8e84595a3eb33cfa7e078da7711e470 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/promotion/pages/admin/couponEdit+couponNew/CustomerCondition.js';
import e0531cefa2e8ec3e46857ac02c9ef49da from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/promotion/pages/admin/couponEdit+couponNew/DiscountType.js';
import e30716e48d0ec79f8ff31505dc8ccc876 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/promotion/pages/admin/couponEdit+couponNew/FormContent.js';
import eecd23335609e19de3f79a3f64b1f63c1 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/promotion/pages/admin/couponEdit+couponNew/General.js';
import e954d72f840c7aef7a0579f773745828d from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/promotion/pages/admin/couponEdit+couponNew/OrderCondition.js';
import e7093bb286f689b026ad940a71b9e5954 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/promotion/pages/admin/couponEdit+couponNew/PageHeading.js';
import e3b7a46c414d422b35b930807aadb6ab3 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/promotion/pages/admin/couponNew/CouponNewForm.js';
import e72cb1e6cfd814afc6ea6bc7b7b298167 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/setting/pages/admin/all/PaymentSettingMenu.js';
import eb0f944bfb3141b6310f69fac9250d8d6 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/setting/pages/admin/all/SettingMenuGroup.js';
import e0481a88768394a59199a444f05572e76 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/setting/pages/admin/all/StoreSettingMenu.js';
import e04003c821fa2af16335da5445cd39651 from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/modules/tax/pages/admin/all/TaxSettingMenu.js';
import collection_products from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/components/admin/widgets/CollectionProductsSetting.js';
import text_block from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/components/admin/widgets/TextBlockSetting.js';
import basic_menu from 'file:///C:/8tvo_semestre/taller/ecomerce_shop/node_modules/@evershop/evershop/dist/components/admin/widgets/BasicMenuSetting.js';
Area.defaultProps.components = {
  header: {
    ef9293976f96fbd24c6b0ef082d095c35: {
      id: 'ef9293976f96fbd24c6b0ef082d095c35',
      sortOrder: 50,
      component: { default: ef9293976f96fbd24c6b0ef082d095c35 }
    },
    ee493f401b0b0d115172a9145ed009969: {
      id: 'ee493f401b0b0d115172a9145ed009969',
      sortOrder: 10,
      component: { default: ee493f401b0b0d115172a9145ed009969 }
    },
    ec30ef99cf5607a457ccea820ba38bad8: {
      id: 'ec30ef99cf5607a457ccea820ba38bad8',
      sortOrder: 20,
      component: { default: ec30ef99cf5607a457ccea820ba38bad8 }
    }
  },
  adminMenu: {
    ec8b0c5a98de1f093e7ee701af0f7be97: {
      id: 'ec8b0c5a98de1f093e7ee701af0f7be97',
      sortOrder: 20,
      component: { default: ec8b0c5a98de1f093e7ee701af0f7be97 }
    },
    ee1e6ee125e7aa44a79c2aa731a1ad982: {
      id: 'ee1e6ee125e7aa44a79c2aa731a1ad982',
      sortOrder: 60,
      component: { default: ee1e6ee125e7aa44a79c2aa731a1ad982 }
    },
    e4a77b0b4d71fe22e8fa1d077756c91ee: {
      id: 'e4a77b0b4d71fe22e8fa1d077756c91ee',
      sortOrder: 10,
      component: { default: e4a77b0b4d71fe22e8fa1d077756c91ee }
    },
    e7df1fed5bea35ee47b820e56fee5556d: {
      id: 'e7df1fed5bea35ee47b820e56fee5556d',
      sortOrder: 40,
      component: { default: e7df1fed5bea35ee47b820e56fee5556d }
    },
    e8f710ddf74ba8b1747194e2f2a1bcb1a: {
      id: 'e8f710ddf74ba8b1747194e2f2a1bcb1a',
      sortOrder: 30,
      component: { default: e8f710ddf74ba8b1747194e2f2a1bcb1a }
    },
    ea0906da0ac46f88595e246d89070a001: {
      id: 'ea0906da0ac46f88595e246d89070a001',
      sortOrder: 50,
      component: { default: ea0906da0ac46f88595e246d89070a001 }
    },
    eb0f944bfb3141b6310f69fac9250d8d6: {
      id: 'eb0f944bfb3141b6310f69fac9250d8d6',
      sortOrder: 500,
      component: { default: eb0f944bfb3141b6310f69fac9250d8d6 }
    }
  },
  quickLinks: {
    e094423146d2478260bf4a7864d739be6: {
      id: 'e094423146d2478260bf4a7864d739be6',
      sortOrder: 20,
      component: { default: e094423146d2478260bf4a7864d739be6 }
    },
    e915f4b15ad6246386b3011d2d77d20c6: {
      id: 'e915f4b15ad6246386b3011d2d77d20c6',
      sortOrder: 30,
      component: { default: e915f4b15ad6246386b3011d2d77d20c6 }
    }
  },
  settingPageMenu: {
    eef5d51f8a0d8812fff952b15f7c792e3: {
      id: 'eef5d51f8a0d8812fff952b15f7c792e3',
      sortOrder: 15,
      component: { default: eef5d51f8a0d8812fff952b15f7c792e3 }
    },
    e72cb1e6cfd814afc6ea6bc7b7b298167: {
      id: 'e72cb1e6cfd814afc6ea6bc7b7b298167',
      sortOrder: 10,
      component: { default: e72cb1e6cfd814afc6ea6bc7b7b298167 }
    },
    e0481a88768394a59199a444f05572e76: {
      id: 'e0481a88768394a59199a444f05572e76',
      sortOrder: 5,
      component: { default: e0481a88768394a59199a444f05572e76 }
    },
    e04003c821fa2af16335da5445cd39651: {
      id: 'e04003c821fa2af16335da5445cd39651',
      sortOrder: 20,
      component: { default: e04003c821fa2af16335da5445cd39651 }
    }
  },
  footerLeft: {
    e2b4952ff3fadd3b10de07a930a6b8c50: {
      id: 'e2b4952ff3fadd3b10de07a930a6b8c50',
      sortOrder: 10,
      component: { default: e2b4952ff3fadd3b10de07a930a6b8c50 }
    },
    e5278d46ded25164c3981871dae35e8ef: {
      id: 'e5278d46ded25164c3981871dae35e8ef',
      sortOrder: 20,
      component: { default: e5278d46ded25164c3981871dae35e8ef }
    }
  },
  body: {
    e742367ef3f19582da0f91a2cc48eb31d: {
      id: 'e742367ef3f19582da0f91a2cc48eb31d',
      sortOrder: 10,
      component: { default: e742367ef3f19582da0f91a2cc48eb31d }
    },
    e192361e5a279f4f19d18f519e43ff03a: {
      id: 'e192361e5a279f4f19d18f519e43ff03a',
      sortOrder: 10,
      component: { default: e192361e5a279f4f19d18f519e43ff03a }
    }
  },
  head: {
    ec5d19bdae26a618f6abc2d4b5532fc37: {
      id: 'ec5d19bdae26a618f6abc2d4b5532fc37',
      sortOrder: 5,
      component: { default: ec5d19bdae26a618f6abc2d4b5532fc37 }
    }
  },
  adminNavigation: {
    e8e9073bc712311ef24f2bfe597649347: {
      id: 'e8e9073bc712311ef24f2bfe597649347',
      sortOrder: 10,
      component: { default: e8e9073bc712311ef24f2bfe597649347 }
    }
  },
  couponEditRight: {
    ee8e84595a3eb33cfa7e078da7711e470: {
      id: 'ee8e84595a3eb33cfa7e078da7711e470',
      sortOrder: 10,
      component: { default: ee8e84595a3eb33cfa7e078da7711e470 }
    }
  },
  couponEditDiscountType: {
    e0531cefa2e8ec3e46857ac02c9ef49da: {
      id: 'e0531cefa2e8ec3e46857ac02c9ef49da',
      sortOrder: 30,
      component: { default: e0531cefa2e8ec3e46857ac02c9ef49da }
    }
  },
  couponForm: {
    e30716e48d0ec79f8ff31505dc8ccc876: {
      id: 'e30716e48d0ec79f8ff31505dc8ccc876',
      sortOrder: 10,
      component: { default: e30716e48d0ec79f8ff31505dc8ccc876 }
    }
  },
  couponEditGeneral: {
    eecd23335609e19de3f79a3f64b1f63c1: {
      id: 'eecd23335609e19de3f79a3f64b1f63c1',
      sortOrder: 10,
      component: { default: eecd23335609e19de3f79a3f64b1f63c1 }
    }
  },
  couponEditLeft: {
    e954d72f840c7aef7a0579f773745828d: {
      id: 'e954d72f840c7aef7a0579f773745828d',
      sortOrder: 10,
      component: { default: e954d72f840c7aef7a0579f773745828d }
    }
  },
  content: {
    e7093bb286f689b026ad940a71b9e5954: {
      id: 'e7093bb286f689b026ad940a71b9e5954',
      sortOrder: 5,
      component: { default: e7093bb286f689b026ad940a71b9e5954 }
    },
    e3b7a46c414d422b35b930807aadb6ab3: {
      id: 'e3b7a46c414d422b35b930807aadb6ab3',
      sortOrder: 10,
      component: { default: e3b7a46c414d422b35b930807aadb6ab3 }
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
        React.createElement(HydrateAdmin, null),
        document.getElementById('app')
      );