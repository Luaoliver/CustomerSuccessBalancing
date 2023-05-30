/**
 * Returns the id of the CustomerSuccess with the most customers
 * @param {array} customerSuccess
 * @param {array} customers
 * @param {array} customerSuccessAway
 */

function customerSuccessBalancing(
  customerSuccess,
  customers,
  customerSuccessAway 
) {
  
  const css = customerSuccess.map(cs => ({ id: cs.id, score: cs.score }));
  const csAway = customerSuccessAway || [];
  const availableCSs = css.filter(cs => !csAway.includes(cs.id));

  const csCount = availableCSs.length;
  const csScores = availableCSs.sort((a, b) => a.score - b.score);
  const customerCount = customers.length;
  const customerScores = customers.sort((a, b) => a.score - b.score);

  //variáveis utilizadas para controlar o index atual
  let csIndex = 0;
  let customerIndex = 0;
  let customerCountByCS = Array(csCount).fill(0);

  //Implementar lógica para distribuir clientes com base no score.
  while (csIndex < csCount && customerIndex < customerCount) {
    if (customerScores[customerIndex].score <= csScores[csIndex].score) {
      customerCountByCS[csIndex]++;
      customerIndex++;
    } else {
      csIndex++;
    }
  }

  //Determinar qual css recebeu mais clientes
  const maxCustomerCount = Math.max(...customerCountByCS);

  if (customerCountByCS.filter(count => count === maxCustomerCount).length > 1) {
    return 0; // Empate
  }

  const maxCustomerIndex = customerCountByCS.findIndex(count => count === maxCustomerCount);

  return csScores[maxCustomerIndex].id;

}


test("Should correctly return the id of the cs with more customers", () => {
  const css = [
    { id: 1, score: 60 },
    { id: 2, score: 20 },
    { id: 3, score: 95 },
    { id: 4, score: 75 },
  ];
  const customers = [
    { id: 1, score: 90 },
    { id: 2, score: 20 },
    { id: 3, score: 70 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 },
  ];
  const csAway = [2, 4];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

function buildSizeEntities(size, score) {
  const result = [];
  for (let i = 0; i < size; i += 1) {
    result.push({ id: i + 1, score });
  }
  return result;
}

function mapEntities(arr) {
  return arr.map((item, index) => ({
    id: index + 1,
    score: item,
  }));
}

function arraySeq(count, startAt){
  return Array.apply(0, Array(count)).map((it, index) => index + startAt);
}

test("Should return a tie when there is more than one CS with the same number of customers", () => {
  const css = mapEntities([11, 21, 31, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Should return the id of the cs with more customers", () => {
  const testTimeoutInMs = 100;
  const testStartTime = new Date().getTime();

  const css = mapEntities(arraySeq(999, 1));
  const customers = buildSizeEntities(10000, 998);
  const csAway = [999];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(998);

  if (new Date().getTime() - testStartTime > testTimeoutInMs) {
    throw new Error(`Test took longer than ${testTimeoutInMs}ms!`);
  }
});

test("Should return a draw when none of the clients are serviced", () => {
  const css = mapEntities([1, 2, 3, 4, 5, 6]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Should return the id correctly when all customers are serviced by the same cs", () => {
  const css = mapEntities([100, 2, 3, 6, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

test("Should return tie when no available cs is able to service clients", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [1, 3, 2];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Should correctly return the id of the cs that serves all customers when the other cs have higher levels", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [4, 5, 6];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(3);
});

test("Should correctly return the id of the cs that serves more customers", () => {
  const css = mapEntities([60, 40, 95, 75]);
  const customers = mapEntities([90, 70, 20, 40, 60, 10]);
  const csAway = [2, 4];
  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});
