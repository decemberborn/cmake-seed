module.exports = (options, files) => {
    return () => {
        return `#include <gtest/gtest.h>

TEST(MyTest, ShouldSucceed) {
    ASSERT_EQ(4, 2+2);
}`;
    }
};
