package com.akto.listener;

import io.micrometer.core.instrument.binder.jvm.JvmGcMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmMemoryMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmThreadMetrics;
import io.micrometer.core.instrument.binder.system.DiskSpaceMetrics;
import io.micrometer.core.instrument.binder.system.ProcessorMetrics;
import io.micrometer.core.instrument.binder.system.UptimeMetrics;
import io.micrometer.prometheus.PrometheusConfig;
import io.micrometer.prometheus.PrometheusMeterRegistry;

import javax.servlet.ServletContextListener;
import java.io.File;

public class InfraMetricsListener implements ServletContextListener {
    public static PrometheusMeterRegistry registry = new PrometheusMeterRegistry(PrometheusConfig.DEFAULT);
    @Override
    public void contextInitialized(javax.servlet.ServletContextEvent sce) {

        System.out.println("Infra metrics initializing.......");
        new JvmThreadMetrics().bindTo(registry);
        new JvmGcMetrics().bindTo(registry);
        new JvmMemoryMetrics().bindTo(registry);
        new DiskSpaceMetrics(new File("/")).bindTo(registry);
        new ProcessorMetrics().bindTo(registry); // metrics related to the CPU stats
        new UptimeMetrics().bindTo(registry);


        System.out.println("Infra metrics initialized!!!!");

    }
}
