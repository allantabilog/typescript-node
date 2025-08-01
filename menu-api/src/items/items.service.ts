/**
 * Date model interfaces
 */
import { BaseItem, Item } from "./item.interface";
import { Items} from "./items.interface";
/**
 * In-memory store
 */

let items: Items = {
    1: {
        id: 1,
        name: "Burger",
        price: 599,
        description: "Tasty",
        image: "https://cdn.auth0.com/blog/whatabyte/burger-sm.png"
    },
    2: {
        id: 2,
        name: "Pizza",
        price: 299,
        description: "Cheesy",
        image: "https://cdn.auth0.com/blog/whatabyte/pizza-sm.png"
    },
    3: {
        id: 3,
        name: "Tea",
        price: 199,
        description: "Informative",
        image: "https://cdn.auth0.com/blog/whatabyte/tea-sm.png"
    }
}

/**
 * service methods
 */
export  const findAll = async(): Promise<Item[]> => Object.values(items);

export  const find = async (id: number): Promise<Item> => items[id];

export const create = async (newItem: BaseItem): Promise<Item> => {
    const id = new Date().valueOf();

    items[id] = {
        id,
        ...newItem,
    };

    return items[id];
}