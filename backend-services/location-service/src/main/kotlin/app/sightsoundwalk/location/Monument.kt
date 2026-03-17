package app.sightsoundwalk.location

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.validation.constraints.NotNull

@Entity
class Monument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null

    @NotNull
    @Column(unique = true)
    lateinit var name: String

    var description: String? = null
    
    var latitude: Double = 0.0
    var longitude: Double = 0.0
    
    var imageUrl: String? = null
    var modelUrl: String? = null // For 3D Map Engine
}
