<template>
  <div>
    <div class="row justify-center items-center">
      <price-input
        :customerPrice="defaultCustomerPrice"
        :setCustomerPrice="setDefaultCustomerPrice"
        :producerRatio="0.85"
        customer
        producer
        width="220px" />
      <div class="row no-wrap items-center">
        <div class="q-ml-md q-mr-lg"> par </div>
        <unit-select
          :unit="defaultUnit"
          :setUnit="setDefaultUnit"
          filter="all"
          withPriceReferenceQuantities
          width="100px" />
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import PriceInput from '../../Price/PriceInput'
import UnitSelect from '../../Units/UnitSelect'
import types from '../../../types'

export default {
  name: 'ProductDefaultPricePerUnitSelector',
  computed: {
    ...mapGetters(['editedProduct']),
    defaultCustomerPrice () {
      /**
       *  TODO: cet accès est buggué
       * setDefaultCustomerPrice est lancé à chaque event tant que customerPrice n'est pas défini
       */
      if (!this.editedProduct.defaultCustomerPrice) this.setDefaultCustomerPrice(0)
      return this.editedProduct.defaultCustomerPrice
    },
    defaultUnit () {
      if (!this.editedProduct.defaultUnit) this.setDefaultUnit(types.units.mass.KG)
      return this.editedProduct.defaultUnit
    }
  },
  methods: {
    ...mapActions(['updateEditedProduct']),
    setDefaultCustomerPrice (value) {
      this.updateEditedProduct({ newProps: { defaultCustomerPrice: value } })
    },
    setDefaultUnit (value) {
      this.updateEditedProduct({ newProps: { defaultUnit: value } })
    }
  },
  components: {PriceInput, UnitSelect}
}
</script>
