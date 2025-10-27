import { Heart, Github, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 品牌信息 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">AnonVote</h3>
            <p className="text-sm text-gray-600 max-w-md">
              基于 FHEVM 全同态加密技术的匿名投票系统，确保投票隐私保护的同时实现结果透明可验证。
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/anonvote"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* 技术特性 */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">技术特性</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>完全匿名投票</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>FHEVM 全同态加密</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>结果可验证</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>防重复投票</span>
              </li>
            </ul>
          </div>

          {/* 相关链接 */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">相关链接</h4>
            <div className="space-y-2">
              <a
                href="https://docs.zama.ai/fhevm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span>FHEVM 文档</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://zama.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span>Zama 官网</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://ethereum.org/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span>隐私保护</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="border-t border-gray-200 pt-6 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-500">
              © 2024 AnonVote. 开源项目，基于 MIT 许可证.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for privacy & democracy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

