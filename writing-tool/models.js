const models = [
  {
    id: "hf:NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
    object: "model",
    name: "hf:NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
    owned_by: "openai",
    openai: {
      id: "hf:NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
      object: "model",
    },
    urlIdx: 1,
    actions: [],
    stats: {
      totalCalls: 0,
      successfulCalls: 0,
      errors: 0,
      totalResponseTime: 0,
      averageResponseTime: 0,
    },
  },
  {
    id: "hf:Qwen/Qwen2.5-7B-Instruct",
    object: "model",
    name: "hf:Qwen/Qwen2.5-7B-Instruct",
    owned_by: "openai",
    openai: { id: "hf:Qwen/Qwen2.5-7B-Instruct", object: "model" },
    urlIdx: 1,
    actions: [],
    stats: {
      totalCalls: 0,
      successfulCalls: 0,
      errors: 0,
      totalResponseTime: 0,
      averageResponseTime: 0,
    },
  },
  {
    id: "hf:google/gemma-2-9b-it",
    object: "model",
    name: "hf:google/gemma-2-9b-it",
    owned_by: "openai",
    openai: { id: "hf:google/gemma-2-9b-it", object: "model" },
    urlIdx: 1,
    actions: [],
    stats: {
      totalCalls: 0,
      successfulCalls: 0,
      errors: 0,
      totalResponseTime: 0,
      averageResponseTime: 0,
    },
  },
  {
    id: "hf:meta-llama/Llama-3.1-8B-Instruct",
    object: "model",
    name: "hf:meta-llama/Llama-3.1-8B-Instruct",
    owned_by: "openai",
    openai: { id: "hf:meta-llama/Llama-3.1-8B-Instruct", object: "model" },
    urlIdx: 1,
    actions: [],
    stats: {
      totalCalls: 0,
      successfulCalls: 0,
      errors: 0,
      totalResponseTime: 0,
      averageResponseTime: 0,
    },
  },
  {
    id: "hf:meta-llama/Llama-3.2-3B-Instruct",
    object: "model",
    name: "hf:meta-llama/Llama-3.2-3B-Instruct",
    owned_by: "openai",
    openai: { id: "hf:meta-llama/Llama-3.2-3B-Instruct", object: "model" },
    urlIdx: 1,
    actions: [],
    stats: {
      totalCalls: 0,
      successfulCalls: 0,
      errors: 0,
      totalResponseTime: 0,
      averageResponseTime: 0,
    },
  },
  {
    id: "hf:mistralai/Mistral-7B-Instruct-v0.3",
    object: "model",
    name: "hf:mistralai/Mistral-7B-Instruct-v0.3",
    owned_by: "openai",
    openai: { id: "hf:mistralai/Mistral-7B-Instruct-v0.3", object: "model" },
    urlIdx: 1,
    actions: [],
    stats: {
      totalCalls: 0,
      successfulCalls: 0,
      errors: 0,
      totalResponseTime: 0,
      averageResponseTime: 0,
    },
  },
  {
    id: "hf:mistralai/Mixtral-8x22B-Instruct-v0.1",
    object: "model",
    name: "hf:mistralai/Mixtral-8x22B-Instruct-v0.1",
    owned_by: "openai",
    openai: { id: "hf:mistralai/Mixtral-8x22B-Instruct-v0.1", object: "model" },
    urlIdx: 1,
    actions: [],
    stats: {
      totalCalls: 0,
      successfulCalls: 0,
      errors: 0,
      totalResponseTime: 0,
      averageResponseTime: 0,
    },
  },
  {
    id: "hf:mistralai/Mixtral-8x7B-Instruct-v0.1",
    object: "model",
    name: "hf:mistralai/Mixtral-8x7B-Instruct-v0.1",
    owned_by: "openai",
    openai: { id: "hf:mistralai/Mixtral-8x7B-Instruct-v0.1", object: "model" },
    urlIdx: 1,
    actions: [],
    stats: {
      totalCalls: 0,
      successfulCalls: 0,
      errors: 0,
      totalResponseTime: 0,
      averageResponseTime: 0,
    },
  },
  {
    id: "hf:upstage/SOLAR-10.7B-Instruct-v1.0",
    object: "model",
    name: "hf:upstage/SOLAR-10.7B-Instruct-v1.0",
    owned_by: "openai",
    openai: { id: "hf:upstage/SOLAR-10.7B-Instruct-v1.0", object: "model" },
    urlIdx: 1,
    actions: [],
    stats: {
      totalCalls: 0,
      successfulCalls: 0,
      errors: 0,
      totalResponseTime: 0,
      averageResponseTime: 0,
    },
  },
];

// Function to update model statistics
function updateModelStats(modelId, responseTime, isError = false) {
  const model = models.find((m) => m.id === modelId);
  if (model) {
    model.stats.totalCalls++;
    if (isError) {
      model.stats.errors++;
    } else {
      model.stats.successfulCalls++;
      model.stats.totalResponseTime += responseTime;
      model.stats.averageResponseTime =
        model.stats.totalResponseTime / model.stats.successfulCalls;
    }
  }
}

// Function to get model performance report
function getModelStats() {
  return models.map((model) => ({
    id: model.id,
    totalCalls: model.stats.totalCalls,
    successRate: `${(
      (model.stats.successfulCalls / model.stats.totalCalls) *
      100
    ).toFixed(2)}%`,
    errorRate: `${((model.stats.errors / model.stats.totalCalls) * 100).toFixed(
      2
    )}%`,
    averageResponseTime: `${(model.stats.averageResponseTime / 1000).toFixed(
      2
    )}s`,
  }));
}

module.exports = {
  models,
  updateModelStats,
  getModelStats,
};
