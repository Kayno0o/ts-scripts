const target = 'HELLO WORLD'
const populationSize = 100
const mutationRate = 0.01
const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ '

interface Individual {
  genes: string
  fitness: number
}

const randomChar = () => charset[Math.floor(Math.random() * charset.length)]

const randomGenes = () => Array.from({ length: target.length }, randomChar).join('')

function calcFitness(genes: string) {
  return [...genes].reduce((acc, char, i) => acc + (char === target[i] ? 1 : 0), 0) / target.length
}

function crossover(a: string, b: string) {
  const midpoint = Math.floor(Math.random() * a.length)
  return a
    .split('')
    .map((_, i) => (i < midpoint ? a[i] : b[i]))
    .join('')
}

function mutate(genes: string) {
  return genes
    .split('')
    .map(char => (Math.random() < mutationRate ? randomChar() : char))
    .join('')
}

let population: Individual[] = Array.from({ length: populationSize }, () => {
  const genes = randomGenes()
  return { genes, fitness: calcFitness(genes) }
})

let generation = 1

do {
  population.sort((a, b) => b.fitness - a.fitness)
  if (generation % 10 === 0) {
    const best = population[0]
    console.log(`Gen ${generation} | Best: ${best.genes} (${(best.fitness * 100).toFixed(1)}%)`)
  }

  const matingPool = population.slice(0, populationSize / 2)
  const newPopulation: Individual[] = []

  for (let i = 0; i < populationSize; i++) {
    const parentA = matingPool[Math.floor(Math.random() * matingPool.length)].genes
    const parentB = matingPool[Math.floor(Math.random() * matingPool.length)].genes
    const childGenes = mutate(crossover(parentA, parentB))
    newPopulation.push({ genes: childGenes, fitness: calcFitness(childGenes) })
  }

  population = newPopulation
  generation++
} while (!population.some(ind => ind.genes === target))

console.log(`Success in generation ${generation}`)
