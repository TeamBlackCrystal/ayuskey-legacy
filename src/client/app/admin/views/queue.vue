<template>
<div>
	<ui-card>
		<template #title><fa :icon="faChartBar"/> {{ i18n.t('title') }}</template>
		<section>
			<header><fa :icon="faPaperPlane"/> {{ i18n.t('domains.deliver') }}</header>
			<x-chart v-if="connection" :connection="connection" :limit="chartLimit" type="deliver"/>
		</section>
		<section>
			<header><fa :icon="faInbox"/> {{ i18n.t('domains.inbox') }}</header>
			<x-chart v-if="connection" :connection="connection" :limit="chartLimit" type="inbox"/>
		</section>
		<section>
			<details>
				<summary>{{ i18n.t('other-queues') }}</summary>
				<section>
					<header><fa :icon="faDatabase"/> {{ i18n.t('domains.db') }}</header>
					<x-chart v-if="connection" :connection="connection" :limit="chartLimit" type="db"/>
				</section>
				<ui-hr/>
				<section>
					<header><fa :icon="faCloud"/> {{ i18n.t('domains.objectStorage') }}</header>
					<x-chart v-if="connection" :connection="connection" :limit="chartLimit" type="objectStorage"/>
				</section>
			</details>
		</section>
		<section>
			<ui-button @click="removeAllJobs">{{ i18n.t('remove-all-jobs') }}</ui-button>
		</section>
	</ui-card>

	<ui-card>
		<template #title><fa :icon="faTasks"/> {{ i18n.t('jobs') }}</template>
		<section class="fit-top">
			<ui-horizon-group inputs>
				<ui-select v-model="domain">
					<template #label>{{ i18n.t('queue') }}</template>
					<option value="deliver">{{ i18n.t('domains.deliver') }}</option>
					<option value="inbox">{{ i18n.t('domains.inbox') }}</option>
					<option value="db">{{ i18n.t('domains.db') }}</option>
					<option value="objectStorage">{{ i18n.t('domains.objectStorage') }}</option>
				</ui-select>
				<ui-select v-model="state">
					<template #label>{{ i18n.t('state') }}</template>
					<option value="active">{{ i18n.t('states.active') }}</option>
					<option value="waiting">{{ i18n.t('states.waiting') }}</option>
					<option value="delayed">{{ i18n.t('states.delayed') }}</option>
				</ui-select>
			</ui-horizon-group>
			<sequential-entrance animation="entranceFromTop" delay="25">
				<div v-for="job in jobs" :key="job.id" class="xvvuvgsv">
					<b>{{ job.id }}</b>
					<template v-if="domain === 'deliver'">
						<span>{{ job.data.to }}</span>
					</template>
					<template v-if="domain === 'inbox'">
						<span>{{ job.data.activity.id }}</span>
					</template>
					<span>{{ `(${job.attempts}/${job.maxAttempts}, ${Math.floor((jobsFetched - job.timestamp) / 1000 / 60)}min)` }}</span>
				</div>
			</sequential-entrance>
			<ui-info v-if="jobs.length == jobsLimit">{{ i18n.t('result-is-truncated', { n: jobsLimit }) }}</ui-info>
		</section>
	</ui-card>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { faTasks, faInbox, faDatabase, faCloud } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane, faChartBar } from '@fortawesome/free-regular-svg-icons';
import { i18n as _i18n } from '../../i18n';
import XChart from './queue.chart.vue';

export default defineComponent({
	compatConfig: {
		MODE: 3,
	},
	components: {
		XChart,
	},

	data() {
		return {
			i18n: _i18n('admin/views/queue.vue'),
			connection: null,
			chartLimit: 200,
			jobs: [],
			jobsLimit: 50,
			jobsFetched: Date.now(),
			domain: 'deliver',
			state: 'delayed',
			faTasks, faPaperPlane, faInbox, faChartBar, faDatabase, faCloud,
		};
	},

	watch: {
		domain() {
			this.jobs = [];
			this.fetchJobs();
		},

		state() {
			this.jobs = [];
			this.fetchJobs();
		},
	},

	mounted() {
		this.fetchJobs();

		this.connection = this.$root.stream.useSharedConnection('queueStats');
		this.connection.send('requestLog', {
			id: Math.random().toString().substr(2, 8),
			length: this.chartLimit,
		});

		this.$once('hook:beforeUnmount', () => {
			this.connection.dispose();
		});
	},

	methods: {
		async removeAllJobs() {
			const process = async () => {
				await this.$root.api('admin/queue/clear');
				this.$root.dialog({
					type: 'success',
					splash: true,
				});
			};

			await process().catch(e => {
				this.$root.dialog({
					type: 'error',
					text: e.toString(),
				});
			});
		},

		fetchJobs() {
			this.$root.api('admin/queue/jobs', {
				domain: this.domain,
				state: this.state,
				limit: this.jobsLimit,
			}).then(jobs => {
				this.jobsFetched = Date.now(),
				this.jobs = jobs;
			});
		},
	},
});
</script>

<style lang="stylus" scoped>
.xvvuvgsv
	margin-left -6px
	> b, span
		margin 0 6px

</style>
