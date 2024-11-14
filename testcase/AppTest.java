package com.example;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.Duration;
import java.util.stream.Stream;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.parallel.Execution;
import org.junit.jupiter.api.parallel.ExecutionMode;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import io.github.bonigarcia.wdm.WebDriverManager;

@Execution(ExecutionMode.CONCURRENT)
public class AppTest {

    private WebDriver driver;

    private static Stream<Arguments> browserProvider() {
        return Stream.of(
            Arguments.of("chrome"),
            Arguments.of("firefox"),
            Arguments.of("edge")
        );
    }

void wait5Seconds()
    {
        try
        {
            Thread.sleep(5000);
        }
        catch(InterruptedException e)
        {
            e.printStackTrace();
        }
    }

    void login(String browser)
    {
        setUp(browser);

        driver.get("https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login");

        // Create a WebDriverWait instance
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // 10 seconds timeout

        // Wait for the button to be present in the DOM
        WebElement customerLoginButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//button[@ng-click='customer()']")));

        // Wait for the button to be clickable
        wait.until(ExpectedConditions.elementToBeClickable(customerLoginButton));

        // Click the button
        customerLoginButton.click(); //At Customer Home Page

        WebElement nameDropDown = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"userSelect\"]")));

        wait.until(ExpectedConditions.elementToBeClickable(nameDropDown));

        Select dropDown = new Select(nameDropDown);

        dropDown.selectByIndex(1);

        WebElement selectedOption = dropDown.getFirstSelectedOption();

        WebElement loginButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/form/button")));
        wait.until(ExpectedConditions.elementToBeClickable(loginButton));
        loginButton.click();
    }

    void withdraw(String amountToWithdrawl, String browser)
    {
        // setUp(browser);
        login(browser);
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // 10 seconds timeout

        WebElement balanceElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(" /html/body/div/div/div[2]/div/div[2]/strong[2]")));
        String balance = balanceElement.getText();

        WebElement withdrawal = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[3]/button[3]")));
        wait.until(ExpectedConditions.elementToBeClickable(withdrawal));
        withdrawal.click();

        WebElement withdrawalInput = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[4]/div/form/div/input")));
        wait.until(ExpectedConditions.elementToBeClickable(withdrawalInput));
        withdrawalInput.clear();
        withdrawalInput.sendKeys(amountToWithdrawl);

        WebElement withdrawalButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[4]/div/form/button")));
        wait.until(ExpectedConditions.elementToBeClickable(withdrawalButton));
        withdrawalButton.click();

        String newBalance = balanceElement.getText();
    }



    private void setUp(String browser) {
        switch (browser) {
            case "chrome":
                WebDriverManager.chromedriver().setup();
                ChromeOptions chromeOptions = new ChromeOptions();
                chromeOptions.addArguments("--headless");
                chromeOptions.addArguments("--disable-gpu");
                driver = new ChromeDriver(chromeOptions);
                // driver = new ChromeDriver();

                break;
            case "firefox":
                WebDriverManager.firefoxdriver().setup();
                FirefoxOptions firefoxOptions = new FirefoxOptions();
                firefoxOptions.addArguments("--headless");
                driver = new FirefoxDriver(firefoxOptions);
                // driver = new FirefoxDriver();

                break;
            case "edge":
                WebDriverManager.edgedriver().setup();
                EdgeOptions edgeOptions = new EdgeOptions();
                edgeOptions.addArguments("--headless");
                driver = new EdgeDriver(edgeOptions);
                // driver = new EdgeDriver();

                break;
            default:
                throw new IllegalArgumentException("Browser not supported: " + browser);
        }
    }

    

    @ParameterizedTest
    @MethodSource("browserProvider")
    public void testCustomerLoginButton(String browser) {
        // Browser setup within the test method
        setUp(browser);

        driver.get("https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login");

        String initialURL = driver.getCurrentUrl();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement customerLoginButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//button[@ng-click='customer()']")));
        wait.until(ExpectedConditions.elementToBeClickable(customerLoginButton));
        customerLoginButton.click();
        wait.until(ExpectedConditions.not(ExpectedConditions.urlToBe(initialURL)));
        String newURL = driver.getCurrentUrl();
        // assertEquals("https://www.globalsqa.com/angularJs-protractor/BankingProject/#/customer", newURL);
        assertEquals("Fail on Purpose", newURL);

    }

    @ParameterizedTest
    @MethodSource("browserProvider")
    public void testDepositing(String browser) {
        String amountToDeposit = "500";
        setUp(browser);

        // Navigate to the webpage
        driver.get("https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login");

        // Create a WebDriverWait instance
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // 10 seconds timeout

        // Wait for the button to be present in the DOM
        WebElement customerLoginButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//button[@ng-click='customer()']")));

        // Wait for the button to be clickable
        wait.until(ExpectedConditions.elementToBeClickable(customerLoginButton));

        // Click the button
        customerLoginButton.click(); //At Customer Home Page

        WebElement nameDropDown = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"userSelect\"]")));

        wait.until(ExpectedConditions.elementToBeClickable(nameDropDown));

        Select dropDown = new Select(nameDropDown);

        dropDown.selectByIndex(1);

        WebElement selectedOption = dropDown.getFirstSelectedOption();

        WebElement loginButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/form/button")));
        wait.until(ExpectedConditions.elementToBeClickable(loginButton));
        loginButton.click();
        

        //After logging in

        //Getting balance
        WebElement balanceElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(" /html/body/div/div/div[2]/div/div[2]/strong[2]")));
        String balance = balanceElement.getText();

        WebElement depositButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(" /html/body/div/div/div[2]/div/div[3]/button[2]")));
        wait.until(ExpectedConditions.elementToBeClickable(depositButton));
        depositButton.click();

        WebElement depositInput = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[4]/div/form/div/input")));
        wait.until(ExpectedConditions.elementToBeClickable(depositInput));
        depositInput.clear();
        depositInput.sendKeys(amountToDeposit);
        
        WebElement depositingButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[4]/div/form/button")));
        wait.until(ExpectedConditions.elementToBeClickable(depositingButton));
        depositingButton.click();
        

        String newBalance = balanceElement.getText();


        // assertEquals(Integer.parseInt(newBalance), Integer.parseInt(balance)+Integer.parseInt(amountToDeposit));
        assertEquals(Integer.parseInt(newBalance), Integer.parseInt(balance)-Integer.parseInt(amountToDeposit)); //Fail on purpose
    }

    @ParameterizedTest
    @MethodSource("browserProvider")
    public void testWithdrawl(String browser)
    {
        String amountToWithdrawl = "100";

        login(browser);
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // 10 seconds timeout

        WebElement balanceElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(" /html/body/div/div/div[2]/div/div[2]/strong[2]")));
        String balance = balanceElement.getText();

        WebElement withdrawal = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[3]/button[3]")));
        wait.until(ExpectedConditions.elementToBeClickable(withdrawal));
        withdrawal.click();

        WebElement withdrawalInput = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[4]/div/form/div/input")));
        wait.until(ExpectedConditions.elementToBeClickable(withdrawalInput));
        withdrawalInput.clear();
        withdrawalInput.sendKeys(amountToWithdrawl);

        WebElement withdrawalButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[4]/div/form/button")));
        wait.until(ExpectedConditions.elementToBeClickable(withdrawalButton));
        withdrawalButton.click();

        String newBalance = balanceElement.getText();
        assertEquals(Integer.parseInt(newBalance), Integer.parseInt(balance)-Integer.parseInt(amountToWithdrawl));

    }

    @ParameterizedTest
    @MethodSource("browserProvider")
    public void testWithdrawlMoreThanCurrentAmount(String browser)
    {
        withdraw("30000",browser);

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // 10 seconds timeout
        WebElement error = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[4]/div/span")));
        String errorMessage = error.getText();
        // String newBalance = String.valueOf(Integer.parseInt(balance) + 100);
        assertEquals("Transaction Failed. You can not withdraw amount more than the balance.",errorMessage);

    }
    @ParameterizedTest
    @MethodSource("browserProvider")
    public void testWithdrawalWithNegative(String browser)
    {
        String amountToWithdrawl = "-100";

        login(browser);
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // 10 seconds timeout

        WebElement balanceElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(" /html/body/div/div/div[2]/div/div[2]/strong[2]")));
        String balance = balanceElement.getText();

        WebElement withdrawal = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[3]/button[3]")));
        wait.until(ExpectedConditions.elementToBeClickable(withdrawal));
        withdrawal.click();

        WebElement withdrawalInput = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[4]/div/form/div/input")));
        wait.until(ExpectedConditions.elementToBeClickable(withdrawalInput));
        withdrawalInput.clear();
        withdrawalInput.sendKeys(amountToWithdrawl);

        WebElement withdrawalButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[4]/div/form/button")));
        wait.until(ExpectedConditions.elementToBeClickable(withdrawalButton));
        withdrawalButton.click();

        String newBalance = balanceElement.getText();
        assertEquals(Integer.parseInt(newBalance), Integer.parseInt(balance)); //Balance shouldn't change as input is negative

    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
