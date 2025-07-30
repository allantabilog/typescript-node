import { User } from './models/user'
import { Product } from './models/product'
import { DynamoStore } from '@shiftcoders/dynamo-easy'
import "reflect-metadata"

describe('Dynamo Easy with Testcontainers', () => {
    let userStore: DynamoStore<User>;

    const waitForTable = async (tableName: string, maxWaitTime: 30000) => {
        const startTime = Date.now();
        while(Date.now() - startTime < maxWaitTime) {
            try {
                const result = await awsDynamoClient.describeTable({
                    TableName: tableName
                }).promise();

                if (result.Table?.TableStatus === 'ACTIVE') {
                    console.log(`✅ Table ${tableName} is now active`);
                    return;
                }
            } catch (error) {}
        

            // wait 500 ms before checking again
            await new Promise(resolve => setTimeout(resolve, 500));
        }
       throw new Error(`Table ${tableName} did not become active within ${maxWaitTime}ms`);
    }

    beforeAll(async () => {
        // create model-specific stores using the global AWS client
        userStore = new DynamoStore(User, awsDynamoClient);

        // create tables
        await awsDynamoClient.createTable({
            TableName: 'users',
            KeySchema: [
                { AttributeName: 'id', KeyType: 'HASH'}
            ],
            AttributeDefinitions: [
                { AttributeName: 'id', AttributeType: 'S'}
            ],
            BillingMode: 'PAY_PER_REQUEST'
        }).promise();

        await waitForTable('users', 30000);

        console.log('✅Tables created successfully.');
    })

    afterAll(async () => {
        // clean up tables
        try {
            await awsDynamoClient.deleteTable({
                TableName: 'users'
            }).promise();
        } catch (err) {
            console.log('Table cleanup error: ', err)
        }
      
    })

    it('can create and find users', async () => {
        // create the user
        const user = new User('user-1', 'Kitty Cat', 'kitty@sanrio.com', 2)

        // store the user
        await userStore.put(user)

        // find the user
        await userStore.get('user-1').exec().then(u => console.log(`found result: ${u}`))
        
    })
})
