<template>
	<div>
		<el-form ref="form" label-width="80px">
			<el-form-item label="SPU名称">
				<span>{{ spu.spuName }}</span>
			</el-form-item>
			<el-form-item label="SKU名称">
				<el-input
					placeholder="SKU名称"
					v-model="skuInfo.skuName"
				></el-input>
			</el-form-item>
			<el-form-item label="价格(元)">
				<el-input
					type="number"
					v-model="skuInfo.price"
					min="0"
				></el-input>
			</el-form-item>
			<el-form-item label="重量(千克)">
				<el-input
					placeholder="重量(千克)"
					v-model="skuInfo.weight"
				></el-input>
			</el-form-item>
			<el-form-item label="规格描述">
				<el-input
					type="textarea"
					rows="4"
					v-model="skuInfo.skuDesc"
				></el-input>
			</el-form-item>
			<el-form-item label="平台属性">
				<el-form ref="form" label-width="80px" :inline="true">
					<el-form-item
						:label="attr.attrName"
						v-for="(attr, index) in attrInfoList"
						:key="attr.id"
					>
						<el-select
							placeholder="请选择"
							v-model="attr.attrIdAndAttrId"
						>
							<el-option
								:label="value.valueName"
								:value="`${attr.id}:${value.id}`"
								v-for="(value, index) in attr.attrValueList"
								:key="value.id"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</el-form-item>

			<el-form-item label="销售属性">
				<el-form ref="form" label-width="80px" :inline="true">
					<el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr,index) in saleAttrValueList" :key="saleAttr.id">
						<el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
							<el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"> </el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</el-form-item>

			<el-form-item label="图片列表">
				<el-table border style="width: 100%" :data="imageList" @selection-change="handleSelectionChange">
					<el-table-column type="selection" prop="prop" width="width">
					</el-table-column>
					<el-table-column prop="prop" label="图片" width="width">
                        <template slot-scope="{row , $index}">
                            <img :src="row.imgUrl" style="width:100px;height:100px">
                        </template>	
					</el-table-column>
					<el-table-column prop="imgName" label="名称" width="width">
					</el-table-column>
					<el-table-column prop="prop" label="操作" width="width">
                        <template slot-scope="{row , $index}">
                            <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)">设置默认</el-button>
                            <el-button v-else >默认</el-button>
                        </template>						
					</el-table-column>
				</el-table>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="save">保存</el-button>
				<el-button @click="cancel">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	name: 'skuForm',
	data() {
		return {
			spu: {},
			imageList: [],
			attrInfoList: [],
			saleAttrValueList: [],
            //被选中的图片
            skuImageList:[],
			skuInfo: {
				category3Id: 0,
				spuId: 0,
				tmId: 0,
				skuName: '',
				price: 0,
				weight: '',
				skuDesc: '',
				skuDefaultImg: '',
				skuImageList: [
				],
				//平台属性
				skuAttrValueList: [
					
				],
				//销售属性
				skuSaleAttrValueList: [
					
				],
			},
		}
	},
	methods: {
		async getData(category1Id, category2Id, spu) {
			this.spu = spu
			this.skuInfo.category3Id = spu.category3Id
			this.skuInfo.spuId = spu.id
			this.skuInfo.tmId = spu.tmId

			//销售属性
			let saleAttrRes = await this.$API.spu.reqSpuSaleAttrListById(spu.id)

			if (saleAttrRes.code == 200) {
				this.saleAttrValueList = saleAttrRes.data
			}

			//获取平台属性
			let attrRes = await this.$API.spu.reqAttrInfoList(
				category1Id,
				category2Id,
				spu.category3Id
			)
			if (attrRes.code == 200) {
				this.attrInfoList = attrRes.data
			}

			//获取图片数据
			let imgRes = await this.$API.spu.reqSpuImageList(spu.id)

			if (imgRes.code == 200) {
				imgRes.data.forEach((item) => {
					item.isDefault = 0
				})
				this.imageList = imgRes.data
			}
		},

		//取消按钮
		cancel() {
			this.$emit('changeScene', { scene: 0, flag: '添加SKU' })
			Object.assign(this._data, this.$options.data())
		},

        //改变默认图片  
        changeDefault(row){
            this.imageList.forEach(item=>{
                item.isDefault = 0
            })
            row.isDefault  = 1
            this.skuInfo.skuDefaultImg = row.imgUrl
        },

        //获取选中图片列表
        handleSelectionChange(val){
            this.skuImageList = val

        },
        //保存数据
        async save(){

           //图片列表
           this.skuInfo.skuImageList = this.skuImageList.map(item=>{
               return {
                   imgName:item.imgName,
                   imgUrl: item.imgUrl,
                   isDefault: item.isDefault,
                   spuImgId:item.spuImgId
               }
           })

           //平台属性
           this.attrInfoList.forEach(item=>{
               if (item.attrIdAndAttrId) {
                   const [ attrId , valueId ] = item.attrIdAndAttrId.split(":")
                   this.skuInfo.skuAttrValueList.push({attrId , valueId})            
               }
           })

           //销售属性
           this.saleAttrValueList.forEach(item=>{
               if (item.attrIdAndValueId) {
                   const [ saleAttrId , saleAttrValueId ] = item.attrIdAndValueId.split(":")
                   this.skuInfo.skuSaleAttrValueList.push({saleAttrId , saleAttrValueId})            
               }
           })

           try {
               await this.$API.spu.reqsaveSkuInfo(this.skuInfo)
               this.$emit('changeScene', { scene: 0, flag: '添加SKU' }) 
                this.$message({type:"success",message:"添加SKU成功"})          
           } catch (error) {
               this.$message(error.message)
               
           }
        }
	},
}
</script>

<style lang='less' scoped>
</style>