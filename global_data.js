class GlobalData {

    constructor(gl, p_lights, p_ui_seeds, p_transfer_function_manager) {

        //---start region: references
        this.p_lights = p_lights;
        this.p_ui_seeds = p_ui_seeds;
        this.p_transfer_function_manager = p_transfer_function_manager;
        //---end region: references

        //---start region: data unit 
        this.data_unit = new DataUnit("global_data");
        this.data_container_dir_lights = new DataContainer("dir_lights", new DirLight());
        this.data_container_streamline_color = new DataContainer("streamline_color", new StreamlineColor());
        this.data_container_scalar_color = new DataContainer("scalar_color", new StreamlineColor());
        this.data_unit.registerDataCollection(this.data_container_dir_lights);
        this.data_unit.registerDataCollection(this.data_container_streamline_color);
        this.data_unit.registerDataCollection(this.data_container_scalar_color);
        //---end region: data unit  

        this.data_textures = new DataTextures(gl, this.data_unit);
    }

    UpdateDataUnit() {
        console.log("UpdateDataUnit");
        this.data_container_dir_lights.data = this.p_lights.dir_lights;
        this.data_container_streamline_color.data = this.p_ui_seeds.getStreamlineColors();
        this.data_container_scalar_color.data = this.p_transfer_function_manager.GetActiveTransferfunctionColorList();
        this.data_unit.generateArrays();
        console.log("UpdateDataUnit completed");
    }

    UpdateDataTextures(gl) {
        console.log("UpdateDataTextures");
        this.data_textures.update(gl);
        console.log("UpdateDataTextures completed");
    }

    bind(gl, shader_uniforms, location_texture_float_global, location_texture_int_global) {
        gl.activeTexture(gl.TEXTURE2);                  // added this and following line to be extra sure which texture is being used...
        gl.bindTexture(gl.TEXTURE_3D, this.data_textures.texture_float.texture);
        gl.uniform1i(location_texture_float_global, 2);
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_3D, this.data_textures.texture_int.texture);
        gl.uniform1i(location_texture_int_global, 3);

        shader_uniforms.setUniform("start_index_int_dir_lights", this.data_unit.getIntStart("dir_lights"));
        shader_uniforms.setUniform("start_index_int_streamline_color", this.data_unit.getIntStart("streamline_color"));
        shader_uniforms.setUniform("start_index_int_scalar_color", this.data_unit.getIntStart("scalar_color"));

        shader_uniforms.setUniform("start_index_float_dir_lights", this.data_unit.getFloatStart("dir_lights"));
        shader_uniforms.setUniform("start_index_float_streamline_color", this.data_unit.getFloatStart("streamline_color"));
        shader_uniforms.setUniform("start_index_float_scalar_color", this.data_unit.getFloatStart("scalar_color"));


        shader_uniforms.updateUniforms();
    }
}