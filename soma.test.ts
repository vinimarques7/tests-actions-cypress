import { soma } from './soma';

function assert(condition: boolean, message: string) {
    if (!condition) throw new Error(message);
}

assert(soma(2, 3) === 5, 'Erro: 2 + 3 deveria ser 5');
assert(soma(0, 0) === 0, 'Erro: 0 + 0 deveria ser 0');
assert(soma(-1, 1) === 0, 'Erro: -1 + 1 deveria ser 0');

console.log('Todos os testes passaram!');