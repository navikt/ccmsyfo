package no.nav.syfo.empower.webapp;


import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Objects;
import java.util.Properties;

@SpringBootApplication
@ComponentScan("no.nav")
@EnableSwagger2
@EnableScheduling
public class Application extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Application.class).properties(getProperties());
    }

    @Bean
    public Docket swaggerSettings() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("no.nav"))
                .paths(PathSelectors.any())
                .build()
                .apiInfo(apiInfo())
                .pathMapping("/");
    }

    private static final Logger LOGGER = LoggerFactory.getLogger(Application.class);
    
    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("NAV - SYFO application for OpenText Exstream Empower and EWS")
                .description("Rest services for OpenText Empower and EWS")
                .version("2.0.0")
                .build();
    }

    static Properties getProperties() {
        Properties properties = new Properties();
        properties.put("spring.config.location", "${catalina.base}/conf/" + splitPath() + ".properties");
        return properties;
    }
    
    public static String splitPath() {
    	String rootPath = Objects.requireNonNull(Thread.currentThread().getContextClassLoader().getResource("")).getPath();
        LOGGER.info(" >>>>> {}", rootPath);
        String[] partsOfPath = rootPath.split("/");
        int partsOfPathLength = partsOfPath.length - 3;
        String rootSYFO = partsOfPath[partsOfPathLength];
        LOGGER.info(" >>>>> /{}", rootSYFO);
        LOGGER.info(" >>>>> /{}/swagger-ui.html", rootSYFO);
        return rootSYFO;
    }
    
}
