package com.arovia.arovia_backend.Config;

import com.arovia.arovia_backend.Entity.Medicine;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.JacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import tools.jackson.databind.ObjectMapper;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Medicine> medicineRedisTemplate(RedisConnectionFactory redisConnectionFactory, ObjectMapper objectMapper) {

        RedisTemplate<String, Medicine> template = new RedisTemplate<>();

        template.setConnectionFactory(redisConnectionFactory);

        // Key serialization
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());

        // Value serialization
        JacksonJsonRedisSerializer<Medicine> serializer =new JacksonJsonRedisSerializer<>(objectMapper, Medicine.class);

        template.setValueSerializer(serializer);
        template.setHashValueSerializer(serializer);

        template.afterPropertiesSet();
        return template;
    }
}