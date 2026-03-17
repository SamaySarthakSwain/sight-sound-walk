package app.sightsoundwalk.location.repository

import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import app.sightsoundwalk.location.Monument

@ApplicationScoped
class MonumentRepository : PanacheRepository<Monument> {
    fun findByNameLike(name: String) = find("name like ?1", "%$name%").list()
}
