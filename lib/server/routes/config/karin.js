import { getKarinConfigList, getKarinConfig, setKarinConfig } from '../../../config/karin.js'
export default async (fastify) => {
  // 获取Karin配置列表
  await fastify.post('/GetKarinConfigList', async (request, reply) => {
    return reply.send({
      status: 'success',
      data: getKarinConfigList()
    })
  })

  // 获取Karin配置
  await fastify.post('/GetKarinConfig', async (request, reply) => {
    const { file } = request.body
    const files = getKarinConfigList()
    let config = {}
    if (file && files.includes(file)) {
      config = getKarinConfig(file)
      return reply.send({
        status: 'success',
        data: config
      })
    } else {
      return reply.send({
        status: 'failed',
        data: {},
        message: '错误，插件不存在！'
      })
    }
  })

  // 设置Karin配置
  await fastify.post('/SetKarinConfig', async (request, reply) => {
    const { file, config } = request.body
    const files = getKarinConfigList()
    let changeConfig = []
    for (let cfg of config) {
      const setFile = file || cfg.file
      if (setFile && files.includes(setFile)) {
        const change = setKarinConfig(setFile, cfg.key, cfg.value)
        if (change && change.value != change.change) {
          changeConfig.push(change)
        }
      }
    }
    if (changeConfig.length > 0) {
      return reply.send({
        status: 'success',
        data: changeConfig
      })
    } else {
      return reply.send({
        status: 'failed',
        data: [],
        message: '未发生可用变动！'
      })
    }
  })
}
