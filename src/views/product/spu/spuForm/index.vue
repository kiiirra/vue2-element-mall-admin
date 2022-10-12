<template>
	<div>
		<el-form ref="form" label-width="80px" :model="spu">
			<el-form-item label="SPU名称">
				<el-input placeholder="SPU名称" v-model="spu.spuName">{{
					spu.spuName
				}}</el-input>
			</el-form-item>
			<el-form-item label="品牌">
				<el-select placeholder="请选择品牌" v-model="spu.tmId">
					<el-option
						:label="tm.tmName"
						:value="tm.id"
						v-for="(tm, index) in tradeMarkList"
						:key="tm.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="SPU描述">
				<el-input
					placeholder="描述"
					type="textarea"
					rows="4"
					v-model="spu.description"
				></el-input>
			</el-form-item>
			
			<el-form-item label="SPU图片">
				<el-upload
					action="/dev-api/admin/product/fileUpload"
					list-type="picture-card"
					:on-preview="handlePictureCardPreview"
					:on-remove="handleRemove"
					:on-success="handleSuccess"
					:file-list="spuImageList"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible">
					<img width="100%" :src="dialogImageUrl" alt="" />
				</el-dialog>
			</el-form-item>
			
			<el-form-item label="销售属性">
				<el-select
					:placeholder="`还有${unSelectSaleAttr.length}个未选择`"
					v-model="attrIdAndAttrName"
				>
					<el-option
						:label="unselect.name"
						:value="`${unselect.id}:${unselect.name}`"
						v-for="(unselect, index) in unSelectSaleAttr"
						:key="unselect.id"
					></el-option>
				</el-select>
				<el-button
					type="primary"
					icon="el-icon-plus"
					:disabled="!attrIdAndAttrName"
					@click="addSaleAttr"
					>添加销售属性
				</el-button>
				<el-table
					style="width: 100%"
					border
					:data="spu.spuSaleAttrList"
				>
					<el-table-column type="index" label="序号" width="80">
					</el-table-column>
					<el-table-column
						prop="saleAttrName"
						label="属性名"
						width="width"
					>
					</el-table-column>
					<el-table-column
						prop="prop"
						label="属性值名称列表"
						width="width"
					>
						<template slot-scope="{ row, $index }">
							<el-tag
								:key="attrValue.id"
								v-for="(
									attrValue, index
								) in row.spuSaleAttrValueList"
								closable
								:disable-transitions="false"
								@close="
									row.spuSaleAttrValueList.splice(index, 1)
								"
							>
								{{ attrValue.saleAttrValueName }}
							</el-tag>
							<el-input
								class="input-new-tag"
								v-if="row.inputVisible"
								v-model="row.inputValue"
								ref="saveTagInput"
								size="small"
								@keyup.enter.native="handleInputConfirm(row)"
								@blur="handleInputConfirm(row)"
							>
							</el-input>
							<el-button
								v-else
								class="button-new-tag"
								size="small"
								@click="addSaleAttrValue(row)"
								>添加</el-button
							>
						</template>
					</el-table-column>
					<el-table-column prop="prop" label="操作" width="width">
						<template slot-scope="{ row, $index }">
							<el-popconfirm
								:title="`确定删除${row.saleAttrName}吗?`"
								@onConfirm="deleteSaleAttr($index)"
							>
								<el-button
									type="danger"
									icon="el-icon-delete"
									slot="reference"
								></el-button>
							</el-popconfirm>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="addOrUpdateSpu"
					>保存</el-button
				>
				<!-- 要通知父组件,不能直接写 -->
				<!-- <el-button @click="scene = 0">取消</el-button> -->
				<el-button @click="cancel">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	name: 'spuForm',
	data() {
		return {
			dialogImageUrl: '',
			dialogVisible: false,
			spu: {
				category3Id: 0,
				description: '',
                spuName: '',
                tmId: '',
				spuImageList: [
				
				],
				
				spuSaleAttrList: [
					
				],
				
			},

			//品牌数据
			tradeMarkList: [],
			spuImageList: [],
			saleAttrList: [],

			//收集被选择的销售属性和Id
			attrIdAndAttrName: '',
		}
	},
	methods: {
		//移除图片的时候要从列表中删除
		handleRemove(file, fileList) {
			this.spuImageList = fileList
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url
			this.dialogVisible = true
		},
		handleSuccess(response, file, fileList) {
			this.spuImageList = fileList
		},

		async getSpuInfo(spu) {
			//获取当前spu数据
			let spuRes = await this.$API.spu.reqSpuInfo(spu.id)
			if (spuRes.code == 200) {
				this.spu = spuRes.data
			}

			//获取品牌数据
			let tmRes = await this.$API.spu.reqTrademarkList()
			if (tmRes.code == 200) {
				this.tradeMarkList = tmRes.data
			}

			//获取图片列表
			let imageRes = await this.$API.spu.reqSpuImageList(spu.id)
            console.log(imageRes);
			if (imageRes.code == 200) {
				let listArr = imageRes.data
				listArr.forEach((item) => {
					item.name = item.imgName
					item.url = item.imgUrl
				})
				this.spuImageList = listArr
			}

			//获取销售属性
			let saleAtterRes = await this.$API.spu.reqSaleAttrList()
			if (saleAtterRes.code == 200) {
				this.saleAttrList = saleAtterRes.data
			}
		},

		//添加销售属性值,点击添加按钮,显示input框
		addSaleAttrValue(row) {
			this.$set(row, 'inputVisible', true)
			this.$set(row, 'inputValue', '')
		},
		//回车/失去焦点时,成功添加属性值
		handleInputConfirm(row) {
			const { baseSaleAttrId, inputValue } = row

			//检查输入是否为空
			if (inputValue.trim() == '') {
				this.$message.error('属性值不能为空')
				return
			}

			//检查是否有重复(every/some)
			let result = row.spuSaleAttrValueList.every(
				(item) => item.saleAttrValueName != inputValue
			)
			if (!result) {
				this.$message.error('请勿输入重复值')
				return
			}

			let newSaleAttrValue = {
				baseSaleAttrId,
				saleAttrValueName: inputValue,
			}
			row.spuSaleAttrValueList.push(newSaleAttrValue)

			//显示button
			row.inputVisible = false
		},

		//删除销售属性
		deleteSaleAttr(index) {
			this.spu.spuSaleAttrList.splice(index, 1)
		},
		//添加销售属性
		addSaleAttr() {
			const [baseSaleAttrId, saleAttrName] =
				this.attrIdAndAttrName.split(':')
			let newSaleAttr = {
				baseSaleAttrId,
				saleAttrName,
				spuSaleAttrValueList: [],
			}
			this.spu.spuSaleAttrList.push(newSaleAttr)
			this.attrIdAndAttrName = ''
		},
		//取消按钮回调
		cancel() {
			this.$emit('changeScene', { scene: 0,flag:this.spu.id?"修改":"添加"})
			Object.assign(this._data, this.$options.data())
			
		},
		//保存修改的属性
		async addOrUpdateSpu() {
			
			this.spu.spuImageList = this.spuImageList.map((item) => {
				return {
					imgName: item.name,
					imgUrl:
						(item.response && item.response.data) || item.url,
				}
			})
 
			//发送请求
			try {
				await this.$API.spu.reqAddOrUpdateSpuInfo(this.spu)
				this.$message({ type: 'success', message: '保存成功' })
                
                this.$emit('changeScene', { scene: 0 ,flag:this.spu.id?"修改":"添加"})
                Object.assign(this._data, this.$options.data())
			} catch (error) {
                this.$message.error("保存失败")
            }
           
		},
        //添加spu按钮
        async getAddSpuInfo(categoryId){
            this.spu.category3Id = categoryId
            //获取品牌数据
			let tmRes = await this.$API.spu.reqTrademarkList()
			if (tmRes.code == 200) {
				this.tradeMarkList = tmRes.data
			}

            //获取销售属性
			let saleAtterRes = await this.$API.spu.reqSaleAttrList()
			if (saleAtterRes.code == 200) {
				this.saleAttrList = saleAtterRes.data
			}


        }
	},
	computed: {
		//计算未被选择的销售属性
		unSelectSaleAttr() {
			let result = this.saleAttrList.filter((item) => {
				return this.spu.spuSaleAttrList.every((item1) => {
					return item.name != item1.saleAttrName
				})
			})
			return result
		},
	},
}
</script>

<style>
.el-tag + .el-tag {
	margin-left: 10px;
}
.button-new-tag {
	margin-left: 10px;
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
}
.input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}
</style>
