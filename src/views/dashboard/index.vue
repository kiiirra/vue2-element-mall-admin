<template>
	<div>
		<Card></Card>
		<Sale></Sale>
		<Observe></Observe>
	</div>
</template>

<script>
import Card from './Card'
import Observe from './Observe'
import Sale from './Sale'
export default {
	name: 'Dashboard',
	components: {
		Card,
		Observe,
		Sale,
	},
}
</script>

<style lang="scss" scoped>
.dashboard {
	&-container {
		margin: 30px;
	}
	&-text {
		font-size: 30px;
		line-height: 46px;
	}
}
</style>
