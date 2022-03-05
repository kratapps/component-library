/**
 * Test class for LightningError.
 * 
 * @author  kratapps.com
 * @date    2021-11-07
 */
@IsTest
private class LightningErrorTest {
    @IsTest
    static void test() {
        String expected, actual;
        expected = '{"output":{"fieldErrors":{},"errors":[]},"enhancedErrorType":"LightningException","statusCode":400,"message":"msg1"}';
        actual = new LightningError('msg1').serialize();
        System.assertEquals(expected, actual);
        expected = '{"output":{"fieldErrors":{"Id":[{"message":"field2","fieldLabel":"Account ID","field":"Id"}],"Name":[{"message":"field1","fieldLabel":"Account Name","field":"Name"}]},"errors":[{"message":"err1"},{"message":"err2"}]},"enhancedErrorType":"LightningException","statusCode":400,"message":"msg2"}';
        actual = new LightningError('msg2')
                .addError('err1')
                .addError('err2')
                .addFieldError('field1', Account.Name)
                .addFieldError('field2', Account.Id)
                .serialize();
        System.assertEquals(expected, actual);
    }
}
