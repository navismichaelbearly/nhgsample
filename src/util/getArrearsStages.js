import compose from 'ramda/src/compose';
import pathOr from 'ramda/src/pathOr';
import curry from 'ramda/src/curry';
import format from 'string-format';

const splitStagesArrayIntoGroupedObjectProperties = (productsArray, { arrearsByStage }) =>
  productsArray.reduce((acc, item) => {
    const tempStagesArray = item.stages
      .map(element => {
        const alreadyThereElement =
          acc[item.product] && acc[item.product].find(el => el.value === element.id);
        if (alreadyThereElement) {
          alreadyThereElement.count += element.count;
          alreadyThereElement.label = format(arrearsByStage, {
            stage: element.name,
            count: alreadyThereElement.count,
          });
          return null;
        }
        return {
          value: element.id,
          name: element.name,
          count: element.count,
          label: format(arrearsByStage, {
            stage: element.name,
            count: element.count,
          }),
          product: item.product,
          id: element.name,
        };
      })
      .filter(arrayEl => arrayEl);
    acc[item.product] = acc[item.product] || [];
    acc[item.product] = acc[item.product].concat(tempStagesArray);
    return acc;
  }, {});

const collateStagesIntoArray = stagesObject => {
  const retArray = stagesObject
    ? Object.keys(stagesObject).map(categoryItem => [
        { disabled: true, value: null, label: categoryItem },
        ...stagesObject[categoryItem],
      ])
    : null;
  return [].concat(...retArray);
};

const addAllStagesItemToArray = curry(({ allStages }, stagesArray) => [
  { value: '', label: allStages },
  ...stagesArray,
]);

export default function getStageItems(statusFilterName, arrearStatuses, labels) {
  const products = pathOr([], [statusFilterName, 'products'], arrearStatuses);
  const createArrayOfGroupedStageItems = compose(
    addAllStagesItemToArray(labels),
    collateStagesIntoArray,
    splitStagesArrayIntoGroupedObjectProperties
  );
  return createArrayOfGroupedStageItems(products, labels);
}
