import Services from '../services';
import { Container } from 'typedi';

export default () => {
    Services.forEach(serviceObj => {
        Container.set(serviceObj.name, serviceObj.service);
    });
};
