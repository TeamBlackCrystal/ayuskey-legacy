<template>
<div>
	<ui-card>
		<template #title><fa :icon="faExclamationCircle"/> {{ i18n.t('title') }}</template>
		<section class="fit-top">
			<sequential-entrance animation="entranceFromTop" delay="25">
				<div v-for="report in userReports" :key="report.id" class="haexwsjc">
					<ui-horizon-group inputs>
						<ui-input :value="report.user | acct" type="text" readonly>
							<span>{{ i18n.t('target') }}</span>
						</ui-input>
						<ui-input :value="report.reporter | acct" type="text" readonly>
							<span>{{ i18n.t('reporter') }}</span>
						</ui-input>
					</ui-horizon-group>
					<ui-textarea :value="report.comment" readonly>
						<span>{{ i18n.t('details') }}</span>
					</ui-textarea>
					<ui-button @click="removeReport(report)">{{ i18n.t('remove-report') }}</ui-button>
				</div>
			</sequential-entrance>
			<ui-button v-if="existMore" @click="fetchUserReports">{{ i18n.t('@.load-more') }}</ui-button>
		</section>
	</ui-card>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { i18n as _i18n } from '../../i18n';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { api, ayuskeyApi } from '../../api';
import { assertIsSuccess } from 'strictcat/built/rpc';

export default defineComponent({
	compatConfig: {
		MODE: 3,
	},

	data() {
		return {
			i18n: _i18n('admin/views/abuse.vue'),
			limit: 10,
			untilId: undefined,
			userReports: [],
			existMore: false,
			faExclamationCircle,
		};
	},

	mounted() {
		this.fetchUserReports();
	},

	methods: {
		fetchUserReports() {
			ayuskeyApi.call('POST', '/admin/abuse-user-reports', {
				body: {
					untilId: this.untilId,
					limit: this.limit + 1,
				},
			}).then(reports => {
				assertIsSuccess(reports);
				if (reports.data.length === this.limit + 1) {
					reports.data.pop();
					this.existMore = true;
				} else {
					this.existMore = false;
				}
				this.userReports = this.userReports.concat(reports);
				this.untilId = this.userReports[this.userReports.length - 1].id;
			});
		},

		removeReport(report) {
			ayuskeyApi.call('POST', '/admin/remove-abuse-user-report', {
				body: {
					reportId: report.id,
				},
			}).then((cb) => {
				assertIsSuccess(cb);
				this.userReports = this.userReports.filter(r => r.id !== report.id);
			});
		},
	},
});
</script>

<style lang="stylus" scoped>
.haexwsjc
	padding-bottom 16px
	border-bottom solid 1px var(--faceDivider)

</style>
