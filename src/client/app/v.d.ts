/// <reference types="vue/macros-global" />

import { ComponentCustomProperties } from 'vue';
import { Store } from 'vuex';

declare module 'vue' {
  import { CompatVue } from 'vue';
  const Vue: CompatVue;
  export default Vue;
  // eslint-disable-next-line vue/prefer-import-from-vue
  export * from 'vue';
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '@vue/runtime-core' {
  // ストアのステートを宣言する
  interface State {
    i: string;
		indicate: boolean;
		uiHeaderHeight: number;
		behindNotes: Array<any>
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}

/*
declare module '*.vue' {
	import Vue from 'vue';
	export default Vue;
}
*/
