<template>
    <div>
        123123123123
        <b-map v-if="mapType === 'BMap'"></b-map>
        <g-map v-if="mapType === 'GMap'"></g-map>
        <open-layer v-if="mapType === 'OpenLayer'"></open-layer>
    </div>
</template>
<script>
import BMap from './BMap';
import GMap from './GMap';
import OpenLayer from './OpenLayer'
export default {
    props:{
        mapType: String,
    },
    components:{
        BMap,
        GMap,
        OpenLayer
    }
}
</script>