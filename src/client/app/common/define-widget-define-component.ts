import { defineComponent } from 'vue';

export default function <T extends object>(data: {
	name: string;
	props?: () => T;
}) {
	return defineComponent({
		compatConfig: {
			MODE: 3,
		},
		props: {
			widget: {
				type: Object,
			},
			column: {
				type: Object,
				default: null,
			},
			platform: {
				type: String,
				required: true,
			},
			isCustomizeMode: {
				type: Boolean,
				default: false,
			},
		},

		data() {
			return {
				bakedOldProps: null,
			};
		},

		computed: {
			id(): string {
				return this.widget.id;
			},

			props(): T {
				return this.widget.data;
			},
		},

		created() {
			this.mergeProps();

			this.$watch('props', () => {
				this.mergeProps();
			});
		},

		methods: {
			mergeProps() {
				if (data.props) {
					const defaultProps = data.props();
					for (const prop of Object.keys(defaultProps)) {
						if (this.props.hasOwnProperty(prop)) continue;
						this.props[prop] = defaultProps[prop];
						//Vue.set(this.props, prop, defaultProps[prop]);
					}
				}
			},

			save() {
				if (this.platform == 'deck') {
					this.$store.commit('updateDeckColumn', this.column);
				} else {
					this.$store.commit('updateWidget', this.widget);
				}
			},
		},
	});
}
