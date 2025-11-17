/**
 * 错误处理工具 - 将各类错误转换为友好的中文提示
 */

interface FriendlyError {
  title: string;
  description: string;
  suggestion?: string;
}

/**
 * 将错误对象转换为友好的中文错误提示
 */
export function getFriendlyErrorMessage(error: any): FriendlyError {
  // 网络错误
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      title: '网络连接失败',
      description: '无法连接到服务器，请检查您的网络连接',
      suggestion: '请稍后重试，或检查网络设置',
    };
  }

  // 超时错误
  if (error.name === 'AbortError' || error.message?.includes('timeout')) {
    return {
      title: '请求超时',
      description: 'AI 响应时间过长，请求已超时',
      suggestion: '请尝试简化输入内容，或稍后重试',
    };
  }

  // HTTP 错误
  if (error.status) {
    switch (error.status) {
      case 400:
        return {
          title: '输入格式错误',
          description: error.message || '提交的数据格式不正确',
          suggestion: '请检查输入内容是否符合要求',
        };

      case 401:
      case 403:
        return {
          title: '访问被拒绝',
          description: 'API 访问权限不足',
          suggestion: '请联系管理员检查配置',
        };

      case 429:
        return {
          title: '请求过于频繁',
          description: '您的请求次数超过限制',
          suggestion: '请稍等片刻后再试',
        };

      case 500:
      case 502:
      case 503:
        return {
          title: '服务器错误',
          description: '服务器暂时无法处理请求',
          suggestion: '请稍后重试，问题持续请联系支持',
        };

      default:
        return {
          title: `请求失败 (${error.status})`,
          description: error.message || '发生未知错误',
          suggestion: '请重试或联系支持',
        };
    }
  }

  // AI 响应格式错误
  if (error.message?.includes('parse') || error.message?.includes('JSON')) {
    return {
      title: 'AI 响应格式异常',
      description: 'AI 返回的内容格式不符合预期',
      suggestion: '请重新生成，或尝试调整输入内容',
    };
  }

  // Zod 验证错误
  if (error.name === 'ZodError' || error.issues) {
    const firstIssue = error.issues?.[0];
    return {
      title: '输入验证失败',
      description: firstIssue?.message || '输入内容不符合要求',
      suggestion: '请检查输入字段的格式和长度',
    };
  }

  // AI 生成内容为空或无效
  if (error.message?.includes('No valid') || error.message?.includes('生成')) {
    return {
      title: '生成失败',
      description: 'AI 未能生成有效内容',
      suggestion: '请尝试调整输入描述，或降低创意度',
    };
  }

  // 默认错误
  return {
    title: '操作失败',
    description: error.message || '发生未知错误，请重试',
    suggestion: '如果问题持续，请刷新页面后重试',
  };
}

/**
 * 为 Magic Word 生成错误提供专属提示
 */
export function getMagicWordErrorMessage(error: any): FriendlyError {
  const baseError = getFriendlyErrorMessage(error);

  // 特殊情况：任务描述过短
  if (error.message?.includes('10 个字符')) {
    return {
      title: '任务描述太简短',
      description: '请至少输入 10 个字符的任务描述',
      suggestion: '提供更多上下文有助于生成更精准的魔法词',
    };
  }

  // 特殊情况：内容过长
  if (error.message?.includes('500 个字符')) {
    return {
      title: '输入内容过长',
      description: '任务描述或风格意图超过字符限制',
      suggestion: '请精简表达，保持在 500 字符以内',
    };
  }

  return baseError;
}

/**
 * 为 Tension Seed 生成错误提供专属提示
 */
export function getTensionSeedErrorMessage(error: any): FriendlyError {
  const baseError = getFriendlyErrorMessage(error);

  // 特殊情况：主题过短
  if (error.message?.includes('5 个字符')) {
    return {
      title: '主题太简短',
      description: '请至少输入 5 个字符的主题',
      suggestion: '明确的主题有助于生成高质量的张力种子',
    };
  }

  // 特殊情况：缺少张力轴
  if (error.message?.includes('张力轴')) {
    return {
      title: '缺少张力轴',
      description: '至少需要一个有效的张力轴',
      suggestion: '添加对立或冲突的概念轴，如"效率 vs 质量"',
    };
  }

  // 特殊情况：张力轴过长
  if (error.message?.includes('100 个字符')) {
    return {
      title: '张力轴过长',
      description: '单个张力轴超过 100 字符限制',
      suggestion: '使用简洁的对立概念表达，如"A vs B"',
    };
  }

  return baseError;
}
